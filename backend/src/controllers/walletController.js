import supabase from "../supabase.js";
import bcrypt from "bcrypt";
export const createWallet = async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: "User ID and wallet name required" });
    }

    const { data, error } = await supabase
      .from("wallets")
      .insert([{ owner_id: userId, name }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({
      message: "Wallet created successfully",
      wallet: data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserWallets = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("owner_id", userId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({ wallets: data });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getWalletById = async (req, res) => {
  try {
    const { walletId } = req.params;

    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("id", walletId)
      .single();

    if (error) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    return res.json({ wallet: data });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};



export const addMoney = async (req, res) => {
  try {
    const { walletId, userId, amount, pin } = req.body;

    if (!walletId || !userId || !amount || !pin) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 1️⃣ Get user PIN hash
    const { data: user } = await supabase
      .from("users")
      .select("pin_hash")
      .eq("id", userId)
      .single();

    const pinValid = await bcrypt.compare(pin, user.pin_hash);
    if (!pinValid) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    // 2️⃣ Create transaction
    const { data: txn } = await supabase
      .from("transactions")
      .insert({
        wallet_id: walletId,
        type: "ADD",
        amount,
        status: "COMPLETED",
        created_by: userId,
      })
      .select()
      .single();

    // 3️⃣ Update wallet balance
    await supabase.rpc("increment_wallet_balance", {
      wallet_id_input: walletId,
      amount_input: amount,
    });

    return res.json({
      message: "Money added successfully",
      transaction: txn,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
