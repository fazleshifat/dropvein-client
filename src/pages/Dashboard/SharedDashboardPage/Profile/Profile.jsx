import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAuth from '../../../../hooks/useAuth';
import useAxios from '../../../../hooks/useAxios';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const Profile = () => {
    const { districts, upazilas } = useLoaderData();
    const { user, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const [userInfo, setUserInfo] = useState({});
    const [profilePic, setProfilePic] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedDistrictName, setSelectedDistrictName] = useState(null);
    const [upazilasRes, setUpazilasRes] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const selectedDistrict = watch('district');

    // Update upazilas based on selected district
    useEffect(() => {
        if (selectedDistrict) {
            const found = districts.find(d => d.name === selectedDistrict);
            if (found) {
                setSelectedDistrictName(found.name);
                const filterUpazilas = upazilas.filter(u => u.district_id === found.id);
                setUpazilasRes(filterUpazilas);
            } else {
                setUpazilasRes([]);
            }
        }
    }, [selectedDistrict]);

    // Fetch and set user data
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user?.email) return;
            try {
                const res = await axiosSecure.get(`/profile?email=${user?.email}`);
                const userData = res.data?.[0];
                if (userData) {
                    setUserInfo(userData);
                    reset(userData);
                    setProfilePic(userData.photoURL);

                    // Prefill district & upazila
                    // const match = districts.find(d => d.name === userData.district);
                    // if (match) {
                    //     setSelectedDistrictName(match.name);
                    //     setUpazilas(match.upazilas || []);
                    // }
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, [user?.email, axios, reset]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Profile";
    }, []);


    // Upload Image to imgbb
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        try {
            setUploading(true);
            const res = await axios.post(uploadUrl, formData);
            setProfilePic(res.data.data.url);
        } catch (error) {
            console.error('Image upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    // Submit Form
    const onSubmit = async (data) => {
        if (!data.name || !data.blood_group || !data.district || !data.upazila) {
            return Swal.fire('Error', 'All fields are required.', 'error');
        }


        const result = await Swal.fire({
            title: 'Confirm Update',
            text: 'Are you sure you want to update your profile?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Yes, update',
            cancelButtonText: 'Cancel',
            denyButtonText: 'Continue Editing'
        });

        if (result.isConfirmed) {
            const updatedInfo = {
                name: data.name,
                photoURL: profilePic,
                district: data.district,
                upazila: data.upazila,
                blood_group: data.blood_group,
            };

            try {
                await updateUserProfile({
                    displayName: updatedInfo.name,
                    photoURL: profilePic,
                });

                await axios.patch(`/users/${user.email}`, updatedInfo);

                toast.success('Profile updated!');
                Swal.fire('Success', 'Your profile has been updated.', 'success');
                setIsEditing(false);
            } catch (err) {
                console.error(err);
                toast.error('Update failed!');
                Swal.fire('Error', 'Something went wrong during update.', 'error');
            }
        } else if (result.isDenied) {
            toast('Continue editing...');
        }
    };

    return (
        <section className='p-5'>
            <div className="min-w-10/12 mx-auto bg-base-200 p-6 rounded shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Profile</h2>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={async () => {
                            if (!isEditing) {
                                const result = await Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You are about to enter edit mode.",
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes, edit',
                                    cancelButtonText: 'Cancel',
                                });
                                if (result.isConfirmed) {
                                    setIsEditing(true);
                                }
                            } else {
                                setIsEditing(false);
                            }
                        }}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-8">
                    {/* Left Section - Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="block font-medium mb-1">Role</label>
                            <input
                                type="text"
                                value={userInfo?.role}
                                disabled
                                className="input input-bordered w-full capitalize"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={userInfo?.email}
                                disabled
                                className="input input-bordered w-full bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Name</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                disabled={!isEditing}
                                className="input input-bordered w-full"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Blood Group</label>
                            {isEditing ? (
                                <>
                                    <select
                                        {...register('blood_group', { required: 'Blood group is required' })}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select</option>
                                        {bloodGroups.map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                    {errors.blood_group && <p className="text-red-500 text-sm mt-1">{errors.blood_group.message}</p>}
                                </>

                            ) : (
                                <input
                                    type="text"
                                    value={userInfo?.blood_group}
                                    disabled
                                    className="input input-bordered w-full"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">District</label>
                            {isEditing ? (
                                <select
                                    {...register('district')}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d.name} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={userInfo?.district}
                                    disabled
                                    className="input input-bordered w-full"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Upazila</label>
                            {isEditing ? (
                                <select
                                    {...register('upazila')}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Upazila</option>
                                    {upazilasRes?.map(u => (
                                        <option key={u.id} value={u.name}>{u.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={userInfo?.upazila}
                                    disabled
                                    className="input input-bordered w-full"
                                />
                            )}
                        </div>

                        {/* Submit Button */}
                        {isEditing && (
                            <div className="col-span-full">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="btn btn-primary w-full"
                                >
                                    {uploading ? 'Uploading...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Right Section - Image and Tags */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="badge uppercase badge-success badge-outline px-4 py-1 text-sm mb-2">
                            {userInfo.status}
                        </span>

                        <img
                            src={profilePic || userInfo?.photoURL}
                            alt="avatar"
                            className="w-32 h-32 rounded-full border-4 p-1 border-blue-400 object-cover"
                        />

                        <span className="badge badge-info mt-2 text-white capitalize">
                            {userInfo?.role || 'User'}
                        </span>

                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input file-input-bordered file-input-sm mt-4"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
