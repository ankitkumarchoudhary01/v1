import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CreateWallet() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) return setError("Wallet name is required");

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/wallet/create", {
        userId: user.id,
        name,
      });

      alert("Wallet created successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create wallet");
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
            Create Your Wallet
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            This wallet will be protected by guardians and approval rules
          </p>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wallet Name
              </label>
              <input
                type="text"
                placeholder="e.g. Family Wallet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              {loading ? "Creating..." : "Create Wallet"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
