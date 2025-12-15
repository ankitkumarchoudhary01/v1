import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/wallet/user/${user.id}`
                );
                setWallets(res.data.wallets);
            } catch (err) {
                console.error("Failed to fetch wallets");
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
    }, [user.id]);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-8 py-10">
                <h1 className="text-3xl font-bold mb-6">
                    Welcome, {user.name} 👋
                </h1>

                {loading ? (
                    <p>Loading...</p>
                ) : wallets.length === 0 ? (
                    // 🚫 No wallet
                    <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
                        <p className="text-gray-600 mb-4">
                            You don’t have a wallet yet.
                        </p>
                        <button
                            onClick={() => navigate("/create-wallet")}
                            className="bg-black text-white px-6 py-2 rounded-lg"
                        >
                            Create Wallet
                        </button>
                    </div>
                ) : (
                    // ✅ Wallet exists
                    <div className="grid md:grid-cols-2 gap-6">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="bg-white p-6 rounded-xl shadow-md"
                            >
                                <h2 className="text-xl font-semibold mb-2">
                                    {wallet.name}
                                </h2>

                                <p className="text-gray-600 mb-4">
                                    Balance
                                </p>

                                <p className="text-3xl font-bold mb-6">
                                    ₹{wallet.balance}
                                </p>

                                <button
                                    className="border px-4 py-2 rounded-lg"
                                    onClick={() => navigate(`/wallet/${wallet.id}`)}
                                >
                                    View Wallet
                                </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}
