import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLoaderData, useNavigate } from 'react-router';
import registerImage from '../../../public/assets/login.png';
import useAuth from '../../hooks/UseAuth';
import useAxios from '../../hooks/useAxios';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const { districts, upazilas } = useLoaderData();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [profilePic, setProfilePic] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const axios = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Dropvein | Register';
    }, []);


    const filteredUpazilas = upazilas?.filter(u => u.district_id == selectedDistrict);

    useEffect(() => {
        if (selectedDistrict) {
            const districtObj = districts?.find(d => d.id == selectedDistrict);
            setSelectedDistrictName(districtObj?.name || '');
        }
    }, [selectedDistrict, districts]);


    const onSubmit = async (data) => {
        try {
            const result = await createUser(data.email, data.password);
            const newUser = result.user;

            await updateUserProfile({
                displayName: data.name,
                photoURL: profilePic,
            });

            const userInfo = {
                name: data.name,
                email: data.email,
                photoURL: profilePic,
                created_at: new Date().toISOString(),
                role: 'donor',
                blood_group: data.blood_group,
                status: 'active',
                district: selectedDistrictName,
                upazila: data.upazila,
            };

            await axios.post('/users', userInfo);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

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

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden">
                {/* Left Image */}
                <div className="bg-base-200 flex items-center justify-center p-6">
                    <img src={registerImage} alt="Register Visual" className="w-full max-w-md rounded-full" />
                </div>

                {/* Right Form */}
                <div className="bg-base-100 p-8">
                <h2 className="text-5xl text-gray-400 font-semibold mb-6 text-center">Account Register</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Profile Upload */}
                        <div className="col-span-2 flex flex-col items-center gap-2">
                            <label className="label">Profile Picture</label>
                            <label className="relative cursor-pointer">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required />
                                {
                                    profilePic
                                        ? <img src={profilePic} className="w-28 h-28 object-cover rounded-full border-2 border-primary" />
                                        : <div className="w-28 h-28 flex items-center justify-center bg-base-200 border-dashed border-2 rounded-full">
                                            <span className="text-xs text-gray-500 text-center">Upload Photo</span>
                                        </div>
                                }
                            </label>
                            {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
                            {profilePic && <p className="text-green-500 text-sm">Image uploaded!</p>}
                        </div>

                        {/* Name */}
                        <div className='col-span-2'>
                            <label className="label">Name</label>
                            <input {...register('name', { required: true })} type="text" placeholder="Your Name" className="input input-bordered w-full" />
                            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                        </div>

                        {/* Email */}
                        <div className='col-span-2'>
                            <label className="label">Email</label>
                            <input {...register('email', { required: true })} type="email" placeholder="Email" className="input input-bordered w-full" />
                            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                        </div>

                        {/* Blood Group */}
                        <div className='col-span-2'>
                            <label className="label">Blood Group</label>
                            <select {...register('blood_group', { required: true })} className="select select-bordered w-full">
                                <option value="">Select your blood group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                            {errors.blood_group && <p className="text-red-500 text-sm">Blood group is required</p>}
                        </div>

                        {/* District */}
                        <div>
                            <label className="label">District</label>
                            <select
                                {...register('district', { required: true })}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select a district</option>
                                {districts?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            {errors.district && <p className="text-red-500 text-sm">District is required</p>}
                        </div>

                        {/* Upazila */}
                        <div>
                            <label className="label">Upazila</label>
                            <select {...register('upazila', { required: true })} className="select select-bordered w-full" disabled={!selectedDistrict}>
                                <option value="">Select an upazila</option>
                                {filteredUpazilas?.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                            </select>
                            {errors.upazila && <p className="text-red-500 text-sm">Upazila is required</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="label">Password</label>
                            <input {...register('password', { required: true, minLength: 6 })} type="password" className="input input-bordered w-full" />
                            {errors.password?.type === 'required' && <p className="text-red-500 text-sm">Password is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-red-500 text-sm">Minimum 6 characters</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="label">Confirm Password</label>
                            <input
                                {...register('confirm_password', {
                                    required: true,
                                    validate: value => value === watch('password') || 'Passwords do not match'
                                })}
                                type="password"
                                className="input input-bordered w-full"
                            />
                            {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>}
                        </div>

                        {/* Submit */}
                        <div className="col-span-2">
                            <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
                                {uploading ? 'Please wait...' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
