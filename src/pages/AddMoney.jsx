import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AddMoney() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || amount <= 0) return setError("Enter valid amount");
    if (!pin || pin.length !== 4) return setError("Enter 4-digit PIN");

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/wallet/add-money", {
        walletId,
        userId: user.id,
        amount: Number(amount),
        pin,
      });

      alert("Money added successfully");
      navigate(`/wallet/${walletId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Add Money to Wallet
          </h2>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-2"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Transaction PIN
              </label>
              <input
                type="password"
                maxLength="4"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-2 text-center tracking-widest"
                placeholder="****"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              {loading ? "Processing..." : "Add Money"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
