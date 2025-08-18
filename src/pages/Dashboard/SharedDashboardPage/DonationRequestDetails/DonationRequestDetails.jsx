import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/UseAuth';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const DonationRequestDetails = () => {
    const { id } = useParams();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Donation Request Details";
    }, []);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['donation-request-details', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/donation-requests/${id}`);
            return res.data;
        }
    });

    const onConfirmDonation = async () => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to confirm your blood donation. Proceed?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, donate!',
            cancelButtonText: 'Cancel'
        });

        if (!confirm.isConfirmed) return;

        setSubmitting(true);
        try {
            await axiosSecure.patch(`/donation-requests/status/${id}/inprogress`, {
                donorName: user?.displayName || 'Anonymous',
                donorEmail: user?.email || 'No Email'
            });
            await refetch();
            Swal.fire({ icon: 'success', title: 'Donation Confirmed' });
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Failed to confirm donation' });
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <Spinner></Spinner>;
    if (isError || !data) return <div className="text-center py-10 text-red-500">Failed to load donation request.</div>;

    const {
        requesterName,
        requesterEmail,
        recipientName,
        recipientDistrict,
        recipientUpazila,
        hospitalName,
        fullAddressLine,
        bloodGroup,
        donationDate,
        donationTime,
        requestMessage,
        donationStatus,
        createdAt,
        updatedAt,
        donorName,
        donorEmail,
        donationConfirmedAt
    } = data;



    return (
        <div className="min-w-10/12 mx-auto flex justify-around p-5">
            <div className="bg-white h-fit dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-10 border-3 border-gray-300">
                <h2 className="text-3xl sm:text-4xl font-md mb-10 text-center text-gray-500">
                    Donation Request Details
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Detail label="Requester Name" value={requesterName} />
                    <Detail label="Requester Email" value={requesterEmail} />
                    <Detail label="Recipient Name" value={recipientName} />
                    <Detail label="District" value={recipientDistrict} />
                    <Detail label="Upazila" value={recipientUpazila} />
                    <Detail label="Hospital Name" value={hospitalName} />
                    <Detail label="Full Address" value={fullAddressLine} />
                    <Detail label="Blood Group" value={bloodGroup} />
                    <Detail label="Donation Date" value={donationDate} />
                    <Detail label="Donation Time" value={donationTime} />
                    <Detail label="Message" value={requestMessage || 'N/A'} />
                    <Detail label="Status" value={donationStatus} />
                    <Detail label="Created At" value={format(new Date(createdAt), 'PPpp')} />
                    <Detail label="Updated At" value={updatedAt ? format(new Date(updatedAt), 'PPpp') : 'Never updated'} />
                    <Detail label="Donor Name" value={donorName || 'Not yet'} />
                    <Detail label="Donor Email" value={donorEmail || 'Not yet'} />
                    <Detail label="Donation Confirmed At" value={donationConfirmedAt ? format(new Date(donationConfirmedAt), 'PPpp') : 'Not yet'} />
                </div>

                <div className="mt-10 text-center">
                    {!donorName ? (
                        <button
                            onClick={() => setIsOpen(true)}
                            className={`w-full bg-blue-400 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow transition disabled:opacity-50 disabled:cursor-not-allowed`}
                            disabled={donationStatus !== 'pending'}
                        >
                            Donate
                        </button>
                    ) : (
                        <button
                            className="btn btn-outline font-semibold py-2 px-6 rounded-full cursor-not-allowed text-red-500 border-red-500"
                        >
                            Donated by {donorName}
                        </button>
                    )}
                </div>
            </div>


            {/* Donation Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-center">Confirm Donation</h2>

                        <form onSubmit={handleSubmit(onConfirmDonation)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Donor Name</label>
                                <input
                                    type="text"
                                    readOnly
                                    defaultValue={user?.displayName}
                                    className="w-full px-4 py-2 rounded border bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Donor Email</label>
                                <input
                                    type="email"
                                    readOnly
                                    defaultValue={user?.email}
                                    className="w-full px-4 py-2 rounded border bg-gray-100"
                                />
                            </div>
                            <div className="flex justify-between gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full ${submitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white py-2 px-4 rounded-lg font-semibold`}
                                >
                                    {submitting ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const Detail = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{label}</p>
        <p className="text-base font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

export default DonationRequestDetails;
