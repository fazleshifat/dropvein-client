import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/UseAuth';
import useAxios from '../../../../hooks/useAxios';
import { useLoaderData } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const EditDonationRequest = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { districts, upazilas } = useLoaderData(); // <-- inject this in route loader

    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const { register, handleSubmit, reset, watch } = useForm();

    const selectedDistrict = watch('recipientDistrict');

    // Update upazilas when district changes
    useEffect(() => {
        const match = districts.find(d => d.name === selectedDistrict);
        if (match) {
            const filtered = upazilas.filter(u => u.district_id === match.id);
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrict]);

    // Fetch the existing data
    useEffect(() => {
        axiosSecure.get(`/donation-requests/${id}`).then(res => {
            reset(res.data);
        });
    }, [id, axios, reset]);

    const onSubmit = async (updateData) => {
        try {
            await axiosSecure.patch(`/donation-requests/${id}`, updateData);
            Swal.fire('Updated!', 'Donation request updated successfully.', 'success');
            navigate(-1);
        } catch (err) {
            Swal.fire('Error', 'Failed to update donation request', 'error');
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Edit Donation Request";
    }, []);

    return (
        <div className="max-w-4xl w-full mx-auto mt-12 p-8 bg-base-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Edit Donation Request</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Readonly fields */}
                <div>
                    <label className="block mb-1 font-medium">Requester Name</label>
                    <input value={user?.displayName || ""} readOnly className="input input-bordered w-full bg-base-200" />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Requester Email</label>
                    <input value={user?.email || ""} readOnly className="input input-bordered w-full bg-base-200" />
                </div>

                {/* Editable fields */}
                <div>
                    <label className="block mb-1 font-medium">Recipient Name</label>
                    <input {...register('recipientName')} className="input input-bordered w-full" />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Blood Group</label>
                    <select {...register('bloodGroup', { required: true })} className="select select-bordered w-full">
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>

                {/* District as select */}
                <div>
                    <label className="block mb-1 font-medium">District</label>
                    <select {...register('recipientDistrict')} className="select select-bordered w-full">
                        <option value="">Select District</option>
                        {districts.map(d => (
                            <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                    </select>
                </div>

                {/* Upazila as select */}
                <div>
                    <label className="block mb-1 font-medium">Upazila</label>
                    <select {...register('recipientUpazila')} className="select select-bordered w-full">
                        <option value="">Select Upazila</option>
                        {filteredUpazilas.map(u => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                        ))}
                    </select>
                </div>

                {/* Rest of your form */}
                <div>
                    <label className="block mb-1 font-medium">Hospital Name</label>
                    <input {...register('hospitalName')} className="input input-bordered w-full" />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Full Address</label>
                    <input {...register('fullAddressLine')} className="input input-bordered w-full" />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Donation Date</label>
                    <input {...register('donationDate')} type="date" className="input input-bordered w-full" />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Donation Time</label>
                    <input {...register('donationTime')} type="time" className="input input-bordered w-full" />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Request Message</label>
                    <textarea {...register('requestMessage')} className="textarea textarea-bordered w-full" rows={4} />
                </div>

                <div className="md:col-span-2 text-center">
                    <button type="submit" className="btn btn-primary px-10">Update Request</button>
                </div>
            </form>
        </div>
    );
};

export default EditDonationRequest;
