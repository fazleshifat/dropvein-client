import React from 'react';
import { FaUsers, FaDonate, FaTint, FaChartLine } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import useUserRole from '../../../../hooks/userUserRole';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const AdminDashboardHome = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading: loadingUsers } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    const { data: donationRequests = [], isLoading: loadingDonations } = useQuery({
        queryKey: ['donation-requests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/donation-requests');
            return res.data.total;
        },
    });

    const { data: totalFundingData = {}, isLoading: loadingFunding } = useQuery({
        queryKey: ['total-funding'],
        queryFn: async () => {
            const res = await axiosSecure.get('/fundings/total');
            return res.data;
        },
    });

    const statCards = [
        {
            icon: <FaUsers className="text-2xl" />,
            title: 'Total Donors',
            count: users.length || 0,
            color: 'from-blue-500 to-blue-600',
            lightBg: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-500',
        },
        ...(role === "admin" || role === "volunteer"
            ? [{
                icon: <FaDonate className="text-2xl" />,
                title: 'Total Funding',
                count: `$${(totalFundingData?.total || 0).toFixed(2)}`,
                color: 'from-emerald-500 to-emerald-600',
                lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
                iconColor: 'text-emerald-500',
            }] : []),
        {
            icon: <FaTint className="text-2xl" />,
            title: 'Blood Requests',
            count: donationRequests,
            color: 'from-red-500 to-red-600',
            lightBg: 'bg-red-50 dark:bg-red-900/20',
            iconColor: 'text-red-500',
        },
    ];

    if (loadingUsers || loadingDonations || loadingFunding) return <Spinner />;

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <FaChartLine className="text-lg text-red-200" />
                        <span className="text-sm text-red-200 font-medium uppercase tracking-wider">{role} Dashboard</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Welcome back, {user?.displayName}
                    </h2>
                    <p className="text-red-100 text-sm max-w-lg">
                        Monitor platform-wide activity including donation requests, donor growth, and funding performance.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.lightBg}`}>
                                <span className={card.iconColor}>{card.icon}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardHome;
