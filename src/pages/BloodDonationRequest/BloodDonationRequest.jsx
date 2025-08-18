import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/UseAuth';
import Spinner from '../../components/Spinner';

const BloodDonationRequests = () => {
    const axios = useAxios();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: donationRequests = [], isLoading } = useQuery({
        queryKey: ['bloodDonationRequest'],
        queryFn: async () => {
            const res = await axios.get('/donation-requests/public?status=pending');
            return res.data;
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Blood Donation Request";
    }, []);


    if (isLoading) {
        return <Spinner></Spinner>;
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-11/12 mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-500">All Pending Donation Requests</h2>

                {donationRequests.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No pending donation requests found.</p>
                ) : (
                    <div className="overflow-x-auto bg-base-200 rounded-2xl shadow ring-1 ring-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
                            <thead className="bg-base-200 text-gray-800 dark:text-gray-200 font-semibold text-xs sm:text-sm uppercase">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Recipient</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Blood Group</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {donationRequests.map((req, idx) => (
                                    <tr key={req._id} className="hover:bg-base-100 transition-all duration-200">
                                        <td className="px-4 py-3 font-medium ">{idx + 1}</td>
                                        <td className="px-4 py-3">{req.recipientName}</td>
                                        <td className="px-4 py-3">{req.recipientDistrict}, {req.recipientUpazila}</td>
                                        <td className="px-4 py-3 font-bold text-red-600">{req.bloodGroup}</td>
                                        <td className="px-4 py-3">{req.donationDate}</td>
                                        <td className="px-4 py-3">{req.donationTime}</td>
                                        <td className="px-4 py-3 capitalize text-indigo-600">{req.donationStatus}</td>
                                        <td className="px-4 py-3">
                                            <Link
                                                to={`/donation-details/${req._id}`}
                                                // onClick={() => handleView(req._id)}
                                                className="btn btn-sm btn-outline btn-info hover:text-white"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

    );
};

export default BloodDonationRequests;
