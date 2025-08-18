import React, { useEffect, useState } from 'react';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/UseAuth';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router';
import useRecentDonationRequests from '../useRecentDonationRequests ';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const MyDonationRequests = () => {
    const { user } = useAuth();
    const userEmail = user?.email;
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch all requests
    const {
        data: donationRequests = [],
        isLoading,
        refetch,
    } = useRecentDonationRequests();

    // Filter only the current user's requests
    const myRequests = donationRequests.filter(req => req.requesterEmail === userEmail);

    // Filter by status
    useEffect(() => {
        let result = [...myRequests];
        if (selectedStatus !== 'all') {
            result = result?.filter(req => req?.donationStatus === selectedStatus);
        }
        setFilteredRequests(result);
        setCurrentPage(1);
    }, [selectedStatus, donationRequests]);

    const totalItems = filteredRequests.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This donation request will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/donation-requests/${id}`);
                    Swal.fire("Deleted!", "Donation request has been deleted.", "success");
                    refetch();
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "Failed to delete request.", "error");
                }
            }
        });
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            axiosSecure.patch(`/my-donation-requests/${status}/${id}`, { status });
            Swal.fire("Updated!", `Status changed to ${status}`, "success");

            refetch();
        } catch (err) {
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | My Donation Request";
    }, []);

    if (isLoading) {
        return <Spinner></Spinner>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Donation Requests</h2>

            {/* Filter Buttons */}
            {

                donationRequests.length > 0 && (
                    <>
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {['all', 'pending', 'inprogress', 'done', 'cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-3 py-1 rounded capitalize ${selectedStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-base-200 dark:border'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </>
                )

            }

            {/* Table */}
            {
                donationRequests.length > 0 ? (
                    filteredRequests.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border-2 border-base-300 dark:border-gray-500">
                            <table className="table w-full text-center">
                                <thead className="bg-base-100">
                                    <tr className='text-center'>
                                        <th>#</th>
                                        <th>Recipient</th>
                                        <th>Location</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Blood</th>
                                        <th>Status</th>
                                        <th>Donor Info</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRequests.map((req, index) => (
                                        <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td>{req.recipientName}</td>
                                            <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                                            <td>{req.donationDate}</td>
                                            <td>{req.donationTime}</td>
                                            <td>{req.bloodGroup}</td>
                                            <td className="capitalize"><span className='bg-accent p-2 rounded-full text-white'>{req.donationStatus}</span></td>
                                            <td>
                                                {req.donationStatus === "inprogress" ? (
                                                    <>
                                                        <p>Name: <span className='font-bold'>{req?.donorName}</span></p>
                                                        <p className="text-sm text-gray-500">Email: <span className='font-bold'>{req?.donorEmail}</span></p>
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="space-x-1">
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
                                                {req.donationStatus === "inprogress" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, "done")}
                                                            className="btn btn-sm btn-success hover:text-white"
                                                        >
                                                            Done
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, "cancelled")}
                                                            className="btn btn-sm btn-warning hover:text-white"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-10 flex flex-col gap-2">
                            You have no donation requests with the selected filter.
                        </div>
                    )
                ) : <>
                    <>
                        <div className="text-gray-500 text-center py-10 flex flex-col gap-2">
                            You have not created any donation request yet.
                            <Link to='/dashboard/create-donation-request' className='btn btn-accent w-fit mx-auto text-white rounded-full'>Create Donation Request</Link>
                        </div>
                    </>
                </>
            }

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex justify-center mt-6 gap-2 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 text-sm rounded border transition-all ${currentPage === i + 1
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-100'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;
