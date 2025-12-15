import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supabase from "../supabase.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("users")
      .insert([{ name, email, password_hash }]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔐 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error || users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "SECRET_KEY", // replace later with env var
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        pin_set: user.pin_set,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const setPin = async (req, res) => {
  try {
    const { userId, pin } = req.body;

    if (!userId || !pin) {
      return res.status(400).json({ message: "User ID and PIN required" });
    }

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "PIN must be 4 digits" });
    }

    const pin_hash = await bcrypt.hash(pin, 10);

    const { error } = await supabase
      .from("users")
      .update({ pin_hash, pin_set: true })
      .eq("id", userId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({ message: "PIN set successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};