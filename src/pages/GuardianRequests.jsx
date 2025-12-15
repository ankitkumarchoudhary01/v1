import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function GuardianRequests() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/guardian/requests/${user.id}`
            );
            setRequests(res.data.requests);
        } catch {
            console.error("Failed to load guardian requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (guardianId, status) => {
        await axios.post("http://localhost:5000/api/guardian/update-status", {
            guardianId,
            status,
        });
        fetchRequests();
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-8 py-10">
                <h1 className="text-3xl font-bold mb-6">
                    Guardian Requests
                </h1>

                {loading ? (
                    <p>Loading...</p>
                ) : requests.length === 0 ? (
                    <p className="text-gray-500">
                        No pending guardian requests.
                    </p>
                ) : (
                    <div className="space-y-4 max-w-xl">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-white p-6 rounded-xl shadow-md"
                            >
                                <p className="font-semibold">
                                    Wallet: {req.wallet.name}
                                </p>

                                <p className="text-sm text-gray-500 mb-4">
                                    Owner: {req.wallet.owner.name} ({req.wallet.owner.email})
                                </p>

                                <div className="flex gap-3 items-center">
                                    {req.status === "PENDING" ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(req.id, "ACCEPTED")}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                Accept
                                            </button>

                                            <button
                                                onClick={() => handleAction(req.id, "REJECTED")}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium
        ${req.status === "ACCEPTED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {req.status}
                                        </span>
                                    )}
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
