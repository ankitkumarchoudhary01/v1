import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


export default function WalletDetails() {
    const { walletId } = useParams();
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [guardians, setGuardians] = useState([]);


    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/wallet/${walletId}`
                );
                setWallet(res.data.wallet);
            } catch (err) {
                console.error("Failed to load wallet");
            } finally {
                setLoading(false);
            }
        };

        const fetchGuardians = async () => {
            const res = await axios.get(
                `http://localhost:5000/api/guardian/wallet/${walletId}/accepted`
            );
            setGuardians(res.data.guardians);
        };

        fetchWallet();
        fetchGuardians();

    }, [walletId]);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-8 py-10">
                {loading ? (
                    <p>Loading wallet...</p>
                ) : !wallet ? (
                    <p>Wallet not found</p>
                ) : (
                    <>
                        {/* Wallet Header */}
                        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                            <h1 className="text-3xl font-bold mb-2">
                                {wallet.name}
                            </h1>
                            <p className="text-gray-500">Wallet ID: {wallet.id}</p>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                            <p className="text-gray-600 mb-2">Current Balance</p>
                            <p className="text-4xl font-bold">
                                ₹{wallet.balance}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Accepted Guardians
                            </h2>

                            {guardians.length === 0 ? (
                                <p className="text-gray-500">
                                    No guardians have accepted yet.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {guardians.map((g) => (
                                        <li
                                            key={g.id}
                                            className="flex justify-between border-b pb-2"
                                        >
                                            <span>{g.users.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {g.users.email}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                        {/* Actions */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <button
                                className="bg-black text-white py-3 rounded-lg"
                                onClick={() => navigate(`/wallet/${wallet.id}/guardians`)}
                            >
                                Add/View Guardians
                            </button>


                            <button
                                className="border py-3 rounded-lg"
                                onClick={() => navigate(`/wallet/${wallet.id}/add-money`)}
                            >
                                Add Money
                            </button>

                            <button
                                className="bg-black text-white py-3 rounded-lg"
                                onClick={() => navigate(`/wallet/${wallet.id}/send-money`)}
                            >
                                Send Money
                            </button>


                            <button
                                className="border py-3 rounded-lg"
                                onClick={() => navigate(`/wallet/${wallet.id}/transactions`)}
                            >
                                View Transactions
                            </button>

                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}
