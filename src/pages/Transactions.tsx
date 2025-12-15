import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Transactions() {
  const { walletId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/transaction/wallet/${walletId}`
        );
        setTransactions(res.data.transactions);
      } catch {
        console.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletId]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-8 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Wallet Transactions
        </h1>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Initiated By</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      {tx.type}
                    </td>

                    <td className="px-4 py-3">
                      ₹{tx.amount}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                          ${
                            tx.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {tx.users?.name || "Unknown"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
