import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const CreateDonationRequest = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, reset } = useForm();

    const [userInfo, setUserInfo] = useState({});
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const districtName = selectedDistrict[0]?.name;

    const selectedDistrictId = watch('recipientDistrict');

    // to get user status
    useEffect(() => {
        const fetchUserInfo = async () => {

            try {
                const res = await axiosSecure.get(`/donor/role?email=${user?.email}`);
                const userData = res.data?.[0];
                if (userData) {
                    setUserInfo(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };
        fetchUserInfo();
    }, [userInfo]);


    // Fetch districts and upazilas from public folder
    useEffect(() => {
        const fetchLocationData = async () => {
            const districtRes = await fetch('/districts.json');
            const upazilaRes = await fetch('/upazilas.json');

            const districtData = await districtRes.json();
            const upazilaData = await upazilaRes.json();

            setDistricts(districtData);
            setUpazilas(upazilaData);
        };
        fetchLocationData();
    }, []);

    // Filter upazilas when district is selected
    useEffect(() => {
        if (selectedDistrictId) {
            const relatedUpazilas = upazilas.filter(
                (u) => u.district_id === selectedDistrictId
            );
            setFilteredUpazilas(relatedUpazilas);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrictId, upazilas]);

    // filter district name
    useEffect(() => {
        const filterDistrict = districts?.filter(d => d.id == selectedDistrictId);
        setSelectedDistrict(filterDistrict);


    }, [selectedDistrictId])

    const mutation = useMutation({
        mutationFn: async (formData) => {
            return await axiosSecure.post('/create-donation-requests', formData);
        },
        onSuccess: () => {
            Swal.fire('Success!', 'Donation request created.', 'success');
            reset();
            navigate('/dashboard/my-donation-requests');
        },
        onError: () => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
        }
    });

    const onSubmit = (data) => {
        const donationRequest = {
            ...data,
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            recipientDistrict: districtName,
            donationStatus: 'pending',
        };
        mutation.mutate(donationRequest);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Create Donation Request";
    }, []);

    return (
        <div className="min-w-11/12 mx-auto p-6 bg-base-100 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">Create Donation Request</h2>
            {userInfo?.status === 'blocked' && (
                <p className="text-red-600 font-medium md:col-span-2">Your account is blocked. You cannot request blood at this time.</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <fieldset disabled={userInfo?.status === 'blocked'} className="contents">

                    <input type="text" readOnly value={user?.displayName || ''} className="input input-bordered w-full" {...register('requesterName')} />
                    <input type="email" readOnly value={user?.email || ''} className="input input-bordered w-full" {...register('requesterEmail')} />

                    <input type="text" placeholder="Recipient Name" className="input input-bordered w-full" {...register('recipientName', { required: true })} />

                    <select {...register('bloodGroup', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Blood Group</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>
                    </select>

                    <select {...register('recipientDistrict', { required: true })} className="select select-bordered w-full">
                        <option value="">Select District</option>
                        {districts.map((district) => (
                            <option key={district.id} value={district.id}>{district.name}</option>
                        ))}
                    </select>

                    <select {...register('recipientUpazila', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Upazila</option>
                        {filteredUpazilas.map((upazila) => (
                            <option key={upazila.id} value={upazila.name}>{upazila.name}</option>
                        ))}
                    </select>

                    <input type="text" placeholder="Hospital Name" className="input input-bordered w-full" {...register('hospitalName', { required: true })} />
                    <input type="text" placeholder="Full Address Line" className="input input-bordered w-full" {...register('fullAddressLine', { required: true })} />


                    <input type="date" className="input input-bordered w-full" {...register('donationDate', { required: true })} />
                    <input type="time" className="input input-bordered w-full" {...register('donationTime', { required: true })} />

                    <div className="md:col-span-2">
                        <textarea placeholder="Request Message" className="textarea textarea-bordered w-full" {...register('requestMessage', { required: true })} rows={4} />
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" className="btn btn-primary w-full">Request Blood</button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default CreateDonationRequest;
