import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SetPin() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{4}$/.test(pin)) {
      return setError("PIN must be exactly 4 digits");
    }

    if (pin !== confirmPin) {
      return setError("PINs do not match");
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/set-pin", {
        userId: user.id,
        pin,
      });

      alert("PIN set successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">
            Set your Transaction PIN
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            This PIN will be required for wallet actions
          </p>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter 4-digit PIN
              </label>
              <input
                type="password"
                maxLength="4"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-2 text-center tracking-widest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm PIN
              </label>
              <input
                type="password"
                maxLength="4"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-2 text-center tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              {loading ? "Setting PIN..." : "Set PIN"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
