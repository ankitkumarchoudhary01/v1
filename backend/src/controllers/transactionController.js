import bcrypt from "bcrypt";
import supabase from "../supabase.js";

export const sendMoney = async (req, res) => {
    try {
        const { walletId, userId, amount, pin, receiver } = req.body;

        if (!walletId || !userId || !amount || !pin) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // 1️⃣ Verify owner PIN
        const { data: user } = await supabase
            .from("users")
            .select("pin_hash")
            .eq("id", userId)
            .single();

        const pinValid = await bcrypt.compare(pin, user.pin_hash);
        if (!pinValid) {
            return res.status(401).json({ message: "Invalid PIN" });
        }

        // 2️⃣ Check wallet balance
        const { data: wallet } = await supabase
            .from("wallets")
            .select("balance")
            .eq("id", walletId)
            .single();

        if (wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // 3️⃣ Create transaction
        const { data: transaction, error: txnError } = await supabase
            .from("transactions")
            .insert({
                wallet_id: walletId,
                type: "SEND",
                amount,
                status: "PENDING",
                created_by: userId,
                receiver: receiver || "External",
            })
            .select()
            .single();

        if (txnError || !transaction) {
            console.error("Transaction insert failed:", txnError);
            return res.status(500).json({
                message: "Failed to create transaction",
            });
        }


        // 4️⃣ Get accepted guardians
        const { data: guardians } = await supabase
            .from("guardians")
            .select("guardian_user_id")
            .eq("wallet_id", walletId)
            .eq("status", "ACCEPTED")
            .not("guardian_user_id", "is", null);

        const validGuardians = guardians.filter(
            (g) => g.guardian_user_id
        );

        if (validGuardians.length === 0) {
            return res.status(400).json({
                message: "No accepted guardians found for this wallet",
            });
        }

        if (!transaction?.id) {
            return res.status(500).json({
                message: "Transaction creation failed",
            });
        }


        // 5️⃣ Create approval rows
        const approvals = [
            {
                transaction_id: transaction.id,
                user_id: userId,
                approved: true,
                approved_at: new Date(),
            },
            ...validGuardians.map((g) => ({
                transaction_id: transaction.id,
                user_id: g.guardian_user_id,
                approved: null,
            })),
        ];


        await supabase.from("transaction_approvals").insert(approvals);

        return res.status(201).json({
            message: "Transaction created. Waiting for guardian approvals.",
            transactionId: transaction.id,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
export const getPendingApprovals = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("transaction_approvals")
      .select(`
        id,
        approved,
        transaction:transaction_id (
          id,
          amount,
          wallet:wallet_id (
            name
          )
        )
      `)
      .eq("user_id", userId)
      .is("approved", null);

    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }

    return res.json({ approvals: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const approveTransaction = async (req, res) => {
  try {
    const { approvalId, userId, pin, decision } = req.body;

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    // 1️⃣ Verify PIN
    const { data: user } = await supabase
      .from("users")
      .select("pin_hash")
      .eq("id", userId)
      .single();

    const pinValid = await bcrypt.compare(pin, user.pin_hash);
    if (!pinValid) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    // 2️⃣ Update approval row
    const { data: approval } = await supabase
      .from("transaction_approvals")
      .update({
        approved: decision === "APPROVED",
        approved_at: new Date(),
      })
      .eq("id", approvalId)
      .select()
      .single();

    // 3️⃣ Fetch all approvals for this transaction
    const { data: allApprovals } = await supabase
      .from("transaction_approvals")
      .select("*")
      .eq("transaction_id", approval.transaction_id);

    // ❌ If any rejected → reject transaction
    if (allApprovals.some(a => a.approved === false)) {
      await supabase
        .from("transactions")
        .update({ status: "REJECTED" })
        .eq("id", approval.transaction_id);

      return res.json({ message: "Transaction rejected" });
    }

    // ✅ If all approved → complete transaction
    if (allApprovals.every(a => a.approved === true)) {
      const { data: txn } = await supabase
        .from("transactions")
        .select("wallet_id, amount")
        .eq("id", approval.transaction_id)
        .single();

      // Deduct money
      await supabase.rpc("increment_wallet_balance", {
        wallet_id_input: txn.wallet_id,
        amount_input: -txn.amount,
      });

      await supabase
        .from("transactions")
        .update({ status: "COMPLETED" })
        .eq("id", approval.transaction_id);

      return res.json({ message: "Transaction completed" });
    }

    return res.json({ message: "Approval recorded, waiting for others" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getWalletTransactions = async (req, res) => {
  try {
    const { walletId } = req.params;

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        type,
        amount,
        status,
        created_at,
        created_by,
        users:created_by (
          name,
          email
        )
      `)
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }

    return res.json({ transactions: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
