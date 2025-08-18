import React from 'react';
import { FaUsers, FaDonate, FaTint } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/useAuth';
import useUserRole from '../../../../hooks/userUserRole';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const AdminDashboardHome = () => {
    const { user } = useAuth();
    const { role } = useUserRole();

    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    // Fetch users
    const { data: users = [], isLoading: loadingUsers } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    // Fetch donation requests
    const { data: donationRequests = [], isLoading: loadingDonations } = useQuery({
        queryKey: ['donation-requests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/donation-requests');
            return res.data.total;
        },
    });

    // Fetching total funding
    const { data: totalFundingData = {}, isLoading: loadingFunding } = useQuery({
        queryKey: ['total-funding'],
        queryFn: async () => {
            const res = await axiosSecure.get('/fundings/total');
            return res.data;
        },
    });



    // all stats for about all information

    const statCards = [
        {
            icon: <FaUsers className="text-4xl text-blue-500" />,
            title: 'Total Donors',
            count: users.length || 0,
            bgColor: 'bg-blue-50 dark:bg-base-200',
            borderColor: 'border-blue-300',
        },
        ...(role === "admin" || role === "volunteer"
            ? [{
                icon: <FaDonate className="text-4xl text-green-500" />,
                title: 'Total Funding',
                count: `$${(totalFundingData?.total || 0).toFixed(2)}`,
                bgColor: 'bg-green-50 dark:bg-base-200',
                borderColor: 'border-green-300',
            }] : []),
        {
            icon: <FaTint className="text-4xl text-red-500" />,
            title: 'Blood Requests',
            count: donationRequests,
            bgColor: 'bg-red-50 dark:bg-base-200',
            borderColor: 'border-red-300',
        },
    ];

    // loading spinner until fetching data
    if (loadingUsers || loadingDonations || loadingFunding) {
        return <Spinner />;
    }


    return (
        <div className="min-w-11/12 mx-auto space-y-6 p-5">
            {/* Welcome Banner */}
            <div className="text-center py-6 bg-base-300 dark:bg-gray-700 rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-white">Welcome <span className='dark:text-gray-300 uppercase'>{user?.displayName}</span> as <span className='text-sky-400 uppercase'>{role} </span>🏥</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm max-w-lg mx-auto">
                    Monitor platform-wide activity including donation requests, donor growth, and funding performance.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        className={`rounded-2xl p-5 border shadow-md ${card.bgColor} ${card.borderColor} border transition-transform hover:scale-[1.02] duration-200`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-white rounded-full p-4 shadow-inner">{card.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-blue-400">{card.title}</h3>
                            <p className="text-2xl font-bold text-gray-800 dark:text-red-500">{card.count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardHome;
