import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TransactionApprovals() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [approvals, setApprovals] = useState([]);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApprovals = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/transaction/pending/${user.id}`
    );
    setApprovals(res.data.approvals);
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (approvalId, decision) => {
    if (pin.length !== 4) {
      return alert("Enter 4-digit PIN");
    }

    setLoading(true);

    await axios.post("http://localhost:5000/api/transaction/approve", {
      approvalId,
      userId: user.id,
      pin,
      decision,
    });

    setPin("");
    fetchApprovals();
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-8 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Pending Transaction Approvals
        </h1>

        {approvals.length === 0 ? (
          <p className="text-gray-500">No pending approvals.</p>
        ) : (
          <div className="space-y-4 max-w-xl">
            {approvals.map((a) => (
              <div key={a.id} className="bg-white p-6 rounded-xl shadow-md">
                <p className="font-semibold">
                  Wallet: {a.transaction.wallet.name}
                </p>
                <p className="mb-3">Amount: ₹{a.transaction.amount}</p>

                <input
                  type="password"
                  maxLength="4"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="border px-4 py-2 rounded w-full mb-3 text-center tracking-widest"
                  placeholder="Enter PIN"
                />

                <div className="flex gap-4">
                  <button
                    disabled={loading}
                    onClick={() => handleAction(a.id, "APPROVED")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => handleAction(a.id, "REJECTED")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
