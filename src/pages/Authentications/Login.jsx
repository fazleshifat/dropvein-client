import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate, useNavigation } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import loginImage from '../../../public/assets/login.png';
import Spinner from '../../components/Spinner';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, userLogin, loading } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const from = location?.state?.from || '/';

    const Navigation = useNavigation()



    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Login";
    }, []);

    const onSubmit = async (data) => {
        try {
            const result = await userLogin(data.email, data.password);

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!',
                timer: 2000,
                showConfirmButton: false
            });

            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || 'Something went wrong!'
            });
        }
    };

    if (Navigation.state === "loading") {
        return <Spinner />;
    }
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-base-100 px-4">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-xl overflow-hidden">
                {/* Left - Image */}
                <div className="bg-base-200 flex items-center justify-center p-6">
                    <img src={loginImage} alt="Login Visual" className="w-full max-w-md" />
                </div>

                {/* Right - Form */}
                <div className="p-8 bg-base-100">
                    <h2 className="text-5xl text-gray-400 font-semibold mb-6 text-center">Login Now</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                {...register('email', { required: true })}
                                className="input input-bordered w-full"
                            />
                            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                // defaultValue=""
                                type="password"
                                placeholder="Enter your password"
                                {...register('password', {
                                    required: true,
                                    minLength: 6
                                })}
                                className="input input-bordered w-full"
                            />
                            {errors.password?.type === 'required' && (
                                <p className="text-red-500 text-sm">Password is required</p>
                            )}
                            {errors.password?.type === 'minLength' && (
                                <p className="text-red-500 text-sm">Password must be 6 characters or longer</p>
                            )}
                        </div>

                        <div className="text-sm text-right">
                            <a className="link link-hover">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn btn-primary w-full">{loading ? 'Logging in...' : 'Login'}</button>
                    </form>

                    <p className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-red-600 font-semibold hover:underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
