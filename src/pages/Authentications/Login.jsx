import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useNavigation } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/Spinner';
import { FaTint, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user, userLogin, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location?.state?.from || '/';
    const Navigation = useNavigation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Login";
    }, []);

    const onSubmit = async (data) => {
        try {
            await userLogin(data.email, data.password);
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
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                {/* Left - Branding */}
                <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-red-700 to-rose-500 p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
                    <div className="relative z-10 text-center space-y-6">
                        <div className="w-24 h-24 mx-auto bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm float">
                            <FaTint className="text-5xl text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">Welcome Back</h2>
                        <p className="text-red-100 text-sm leading-relaxed max-w-xs mx-auto">
                            Sign in to access your dashboard, manage donations, and continue saving lives.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold">500+</p>
                                <p className="text-xs text-red-200">Lives Saved</p>
                            </div>
                            <div className="w-px bg-red-400/50"></div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">1K+</p>
                                <p className="text-xs text-red-200">Donors</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Form */}
                <div className="p-8 md:p-10 bg-white dark:bg-gray-800">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email', { required: true })}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">Email is required</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register('password', { required: true, minLength: 6 })}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200"
                                />
                            </div>
                            {errors.password?.type === 'required' && <p className="text-red-500 text-xs mt-1">Password is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-red-500 text-xs mt-1">Password must be 6 characters or longer</p>}
                        </div>

                        <div className="text-right">
                            <a className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer font-medium">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
