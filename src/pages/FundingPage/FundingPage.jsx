import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Elements } from "@stripe/react-stripe-js";
import FundingForm from "./FundingForm";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const FundingPage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [fundings, setFundings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [shouldRefetch, setShouldRefetch] = useState(false); // ✅ Track refetch trigger


    useEffect(() => {
        const fetchFundings = async () => {
            try {
                const res = await axiosSecure.get(`/fundings?page=${page}&limit=${limit}&email=${user?.email}`);
                setFundings(res.data.fundings);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Failed to load fundings", err);
            }
        };
        if (user?.email) fetchFundings();
    }, [page, showForm, user?.email, shouldRefetch]); // ✅ added `shouldRefetch`


    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Fundings</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-2 rounded-full font-medium shadow hover:from-sky-600 hover:to-blue-700 transition duration-200"
                >
                    {showForm ? "Close Form" : "Give Fund"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-white dark:bg-base-200 shadow rounded-xl">
                    <Elements stripe={stripePromise}>
                        <FundingForm
                            user={user}
                            onDonationSuccess={() => {
                                setShowForm(false);
                                setShouldRefetch((prev) => !prev); // ✅ toggle refetch
                            }}
                        />
                    </Elements>
                </div>
            )}

            <div className="overflow-x-auto mt-8 shadow rounded-lg border dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {fundings.map((f, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-300">{f.name}</td>
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-300">{f.email}</td>
                                <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">${f.amount}</td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-400">{new Date(f.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-500">{f.transactionId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-4 py-1 rounded-full font-medium border ${i + 1 === page
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            } transition`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );

};

export default FundingPage;
