import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../../../hooks/useAxios';
import { useNavigate } from 'react-router';
import useUserRole from '../../../../hooks/userUserRole';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const statuses = ['pending', 'inprogress', 'done', 'cancelled'];

const AllDonationRequests = () => {
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const { role } = useUserRole();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();
    const limit = 10;

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Dropvein | All Donation Request';
    }, []);

    const { data: donationRequests = { data: [], total: 0 }, isLoading, refetch } = useQuery({
        queryKey: ['donationRequests', currentPage, filterStatus],
        queryFn: async () => {
            const statusQuery = filterStatus !== 'all' ? `&status=${filterStatus}` : '';
            const res = await axiosSecure.get(`/donation-requests?page=${currentPage}&limit=${limit}${statusQuery}`);
            return res.data;
        }
    });

    const { mutate: updateStatus } = useMutation({
        mutationFn: async ({ id, status }) => {
            return await axiosSecure.patch(`/donation-requests/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['donationRequests']);
            Swal.fire('Updated!', 'Donation status has been updated.', 'success');
        },
        onError: () => {
            Swal.fire('Error', 'Could not update status', 'error');
        }
    });

    const needActionForVolunteer = useMemo(() => {
        return donationRequests?.data?.some(req => req.donationStatus === 'inprogress');
    }, [donationRequests]);

    const handleStatusChangeByAdmin = (id, status) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to change status to ${status}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus({ id, status });
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This donation request will be deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/donation-requests/${id}`);
                    Swal.fire('Deleted!', 'Donation request has been deleted.', 'success');
                    refetch();
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error', 'Failed to delete request.', 'error');
                }
            }
        });
    };

    const handleStatusUpdateAfterInprogress = async (id, status) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to mark this request as ${status}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, mark as ${status}`,
            confirmButtonColor: status === 'done' ? '#16a34a' : '#d97706',
            cancelButtonColor: '#d33',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/my-donation-requests/${status}/${id}`, { status });
                    Swal.fire('Updated!', `Status changed to ${status}`, 'success');
                    queryClient.invalidateQueries(['donationRequests']);
                } catch (err) {
                    Swal.fire('Error', 'Failed to update status.', 'error');
                }
            }
        });
    };

    const total = donationRequests?.total || 0;
    const totalPages = Math.ceil(total / limit);

    if (isLoading) {
        return <Spinner></Spinner>;
    }

    return (
        <div className="p-4 transition-all">
            <h2 className="text-2xl font-bold mb-6">All Blood Donation Requests 🩸</h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-1 rounded-full border-2 border-gray-400 ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-base-100'}`}
                >
                    All
                </button>
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => {
                            setFilterStatus(status);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-1 rounded-full border-2 border-gray-400 capitalize ${filterStatus === status ? 'bg-blue-600 text-white' : 'bg-base-100'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* 🔍 Empty state if no requests */}
            {donationRequests?.data?.length === 0 ? (
                <div className="py-10 text-center text-gray-500 text-lg border border-dashed rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                    {filterStatus === 'all'
                        ? 'No donation requests found.'
                        : `No donation requests found for "${filterStatus}" status.`}
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl shadow border-2 border-gray-300">
                        <table className="min-w-full divide-y divide-gray-200 text-lg">
                            <thead className="bg-base-300 text-left text-gray-700 font-semibold">
                                <tr className="text-center dark:text-white">
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Recipient Name</th>
                                    <th className="px-4 py-3">Blood Group</th>
                                    <th className="px-4 py-3">District</th>
                                    <th className="px-4 py-3">Upazila</th>
                                    <th className="px-4 py-3">Requester Name</th>
                                    <th className="px-4 py-3">Donor Name</th>
                                    <th className="px-4 py-3">Donor Email</th>
                                    <th className="px-4 py-3">Donation Time</th>
                                    <th className="px-4 py-3">Status</th>
                                    {role === 'admin' && <th className="px-4 py-3">Update Status</th>}
                                    {(role === 'admin' || (role === 'volunteer' && needActionForVolunteer)) && (
                                        <th className="px-4 py-3">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-center">
                                {donationRequests.data.map((req, index) => (
                                    <tr key={req._id} className="hover:bg-base-300">
                                        <td className="px-4 py-2">{(currentPage - 1) * limit + index + 1}</td>
                                        <td className="px-4 py-2">{req.recipientName}</td>
                                        <td className="px-4 py-2 font-medium text-red-600">{req.bloodGroup}</td>
                                        <td className="px-4 py-2">{req.recipientDistrict}</td>
                                        <td className="px-4 py-2">{req.recipientUpazila}</td>
                                        <td className="px-4 py-2">{req.requesterName}</td>
                                        <td className="px-4 py-2">{req.donorName || 'N/A'}</td>
                                        <td className="px-4 py-2">{req.donorEmail || 'N/A'}</td>
                                        <td className="px-4 py-2">{req.donationDate} - {req.donationTime}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold text-white capitalize
                          ${req.donationStatus === 'pending'
                                                        ? 'bg-yellow-500'
                                                        : req.donationStatus === 'inprogress'
                                                            ? 'bg-blue-500'
                                                            : req.donationStatus === 'cancelled'
                                                                ? 'bg-red-600'
                                                                : 'bg-green-500'
                                                    }`}
                                            >
                                                {req.donationStatus}
                                            </span>
                                        </td>

                                        {role === 'admin' && (
                                            <td className="px-4 py-2">
                                                <select
                                                    value={req.donationStatus}
                                                    onChange={(e) => handleStatusChangeByAdmin(req._id, e.target.value)}
                                                    className="border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                >
                                                    {statuses.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        )}

                                        {(role === 'admin' || role === 'volunteer') && (
                                            <td className="space-x-1 space-y-1">
                                                {role === 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/donation-details/${req._id}`)}
                                                            className="btn btn-sm btn-outline btn-info hover:text-white"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/dashboard/edit-donation/${req._id}`)}
                                                            className="btn btn-sm btn-outline btn-accent hover:text-white"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(req._id)}
                                                            className="btn btn-sm btn-outline btn-error hover:text-white"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                {req.donationStatus === 'inprogress' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdateAfterInprogress(req._id, 'done')}
                                                            className="btn btn-sm btn-success hover:text-white"
                                                        >
                                                            Done
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdateAfterInprogress(req._id, 'cancelled')}
                                                            className="btn btn-sm btn-warning hover:text-white"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 gap-2">
                        {[...Array(totalPages).keys()].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page + 1)}
                                className={`px-3 py-1 rounded-full border ${currentPage === page + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-black'
                                    }`}
                            >
                                {page + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AllDonationRequests;
