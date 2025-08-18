import React from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import useRecentDonationRequests from "../useRecentDonationRequests ";
import useUserRole from "../../../../hooks/userUserRole";
import useAuth from "../../../../hooks/UseAuth";
import Spinner from "../../../../components/Spinner";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";


const DonorDashboardHome = () => {
    const { user } = useAuth();
    const { role } = useUserRole();

    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const {
        data: donationRequests = [],
        isLoading,
        refetch,
    } = useRecentDonationRequests();

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
                    // 👇 You can use axiosSecure for protected DELETE
                    await axiosSecure.delete(`/donation-requests/${id}`);
                    Swal.fire("Deleted!", "Donation request has been deleted.", "success");
                    refetch(); // refetch list
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "Failed to delete request.", "error");
                }
            }
        });
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axiosSecure.patch(`/donation-requests/status/${id}`, { status });
            Swal.fire("Updated!", `Status changed to ${status}`, "success");
            refetch(); // refresh data
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to update status.", "error");
        }
    };

    if (isLoading) {
        return <Spinner></Spinner>;
    }


    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Welcome, {user?.displayName} now you are a {role} 🏠
                </h2>
                <p className="text-gray-800 dark:text-gray-200">Here are your recent donation requests.</p>
            </div>

            {/* Donation Requests Table */}
            {donationRequests.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border-2 border-base-300 dark:border-gray-500">
                    <table className="table w-full text-center">
                        <thead className="bg-base-100">
                            <tr>
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
                            {donationRequests.slice(0, 3).map((req, index) => (
                                <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td>{index + 1}</td>
                                    <td>{req.recipientName}</td>
                                    <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                                    <td>{req.donationDate}</td>
                                    <td>{req.donationTime}</td>
                                    <td>{req.bloodGroup}</td>
                                    <td className="capitalize">{req.donationStatus}</td>
                                    <td>
                                        {req.donationStatus === "inprogress" ? (
                                            <>
                                                <p>{user?.displayName}</p>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
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
                                                    onClick={() => handleStatusUpdate(req._id, "canceled")}
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
                <div className="text-gray-500 text-center py-10">
                    {/* You have not made any donation requests yet. */}
                </div>
            )}

            {/* View All Button */}
            {donationRequests.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={() => navigate("/dashboard/my-donation-requests")}
                        className="btn btn-primary"
                    >
                        View My All Requests
                    </button>
                </div>
            )}
        </div>
    );
};

export default DonorDashboardHome;
