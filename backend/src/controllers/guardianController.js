import supabase from "../supabase.js";

/**
 * Add guardian by email
 */
export const addGuardian = async (req, res) => {
  try {
    const { walletId, guardianEmail } = req.body;

    if (!walletId || !guardianEmail) {
      return res.status(400).json({ message: "Wallet ID and email required" });
    }

    // 1️⃣ Find user by email
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", guardianEmail)
      .limit(1);

    if (userError || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const guardianUser = users[0];

    // 2️⃣ Insert guardian
    const { error } = await supabase.from("guardians").insert([
      {
        wallet_id: walletId,
        guardian_user_id: guardianUser.id,
        status: "PENDING",
      },
    ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({
      message: "Guardian added successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get guardians of a wallet
 */
export const getWalletGuardians = async (req, res) => {
  try {
    const { walletId } = req.params;

    const { data, error } = await supabase
      .from("guardians")
      .select(`
        id,
        status,
        users ( name, email )
      `)
      .eq("wallet_id", walletId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({ guardians: data });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyGuardianRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("guardians")
      .select(`
        id,
        status,
        wallet:wallet_id (
          id,
          name,
          owner:owner_id (
            name,
            email
          )
        )
      `)
      .eq("guardian_user_id", userId)
      .eq("status", "PENDING");

    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }

    return res.json({ requests: data });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateGuardianStatus = async (req, res) => {
  try {
    const { guardianId, status } = req.body;

    if (!guardianId || !["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const { error } = await supabase
      .from("guardians")
      .update({ status })
      .eq("id", guardianId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({ message: `Guardian ${status.toLowerCase()}` });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const getAcceptedGuardians = async (req, res) => {
  try {
    const { walletId } = req.params;

    const { data, error } = await supabase
      .from("guardians")
      .select(`
        id,
        status,
        users:guardian_user_id (
          name,
          email
        )
      `)
      .eq("wallet_id", walletId)
      .eq("status", "ACCEPTED");

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({ guardians: data });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};


