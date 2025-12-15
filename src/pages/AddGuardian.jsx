import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AddGuardian() {
  const { walletId } = useParams();
  const [email, setEmail] = useState("");
  const [guardians, setGuardians] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));


  const fetchGuardians = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/guardian/wallet/${walletId}`
      );
      setGuardians(res.data.guardians);
    } catch {
      console.error("Failed to fetch guardians");
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, [walletId]);

  const handleAddGuardian = async (e) => {
  e.preventDefault();
  setError("");

  if (!email) return setError("Email required");

  // ❌ Prevent adding self as guardian
  if (email.toLowerCase() === user.email.toLowerCase()) {
    return setError("You cannot add yourself as a guardian");
  }

  try {
    setLoading(true);

    await axios.post("http://localhost:5000/api/guardian/add", {
      walletId,
      guardianEmail: email,
    });

    setEmail("");
    fetchGuardians();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to add guardian");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-8 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Add Guardians
        </h1>

        {/* Add Guardian Form */}
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md mb-8">
          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleAddGuardian} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guardian Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guardian@example.com"
                className="mt-1 w-full border rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              {loading ? "Adding..." : "Add Guardian"}
            </button>
          </form>
        </div>

        {/* Guardian List */}
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            Current Guardians
          </h2>

          {guardians.length === 0 ? (
            <p className="text-gray-500">No guardians added yet.</p>
          ) : (
            <ul className="space-y-3">
              {guardians.map((g) => (
                <li
                  key={g.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{g.users.name}</p>
                    <p className="text-sm text-gray-500">
                      {g.users.email}
                    </p>
                  </div>
                  <span className="text-sm">
                    {g.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
