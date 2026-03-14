import { Link, NavLink, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../../components/ThemeToggle';
import BookingButton from '../../components/HomeComponent/BookingButton/BookingButton';

const Navbar = () => {
    const { user, loading, userLogOut } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout',
        }).then((result) => {
            if (result.isConfirmed) {
                userLogOut();
                setMobileOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'You have been successfully logged out.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate('/login');
            }
        });
    };

    const navLinkClass = ({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive
            ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
            : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/10'
        }`;

    return (
        <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'glass-nav shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
            : 'bg-base-100/95 dark:bg-gray-900/95 border-b border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <img
                                src="/assets/login.png"
                                alt="Logo"
                                className="w-9 h-9 object-contain rounded-full ring-2 ring-red-100 dark:ring-red-900/40 group-hover:ring-red-300 dark:group-hover:ring-red-700 transition-all"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-gray-800 dark:text-gray-100">Drop</span>
                            <span className="gradient-text">vein</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                        <NavLink to="/blood-donation-requests" className={navLinkClass}>Donation Requests</NavLink>
                        <NavLink to="/blogs" className={navLinkClass}>Blog</NavLink>
                        {user && <NavLink to="/funding" className={navLinkClass}>Funding</NavLink>}
                        <BookingButton />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {!loading && (
                            <>
                                {!user ? (
                                    <div className="hidden md:flex items-center gap-2">
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="hidden md:block dropdown dropdown-end">
                                        <div
                                            tabIndex={0}
                                            className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                        >
                                            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-red-200 dark:ring-red-800">
                                                <img src={user?.photoURL} alt="User" className="w-full h-full object-cover" />
                                            </div>
                                            <FiChevronDown className="text-gray-500 text-sm" />
                                        </div>
                                        <div
                                            tabIndex={0}
                                            className="dropdown-content mt-3 p-4 bg-base-100 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-56 z-[1]"
                                        >
                                            <div className="text-center pb-3 border-b border-gray-200 dark:border-gray-700">
                                                <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 ring-2 ring-red-200 dark:ring-red-800">
                                                    <img src={user?.photoURL} alt="User" className="w-full h-full object-cover" />
                                                </div>
                                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                                                    {user?.displayName}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            <div className="pt-3 space-y-2">
                                                <Link
                                                    to="/dashboard"
                                                    className="block w-full text-center py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg transition-all"
                                                >
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 border-t border-gray-200 dark:border-gray-700' : 'max-h-0'}`}>
                <div className="px-4 py-4 space-y-1 bg-base-100 dark:bg-gray-900">
                    <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)} end>Home</NavLink>
                    <NavLink to="/blood-donation-requests" className={navLinkClass} onClick={() => setMobileOpen(false)}>Donation Requests</NavLink>
                    <NavLink to="/blogs" className={navLinkClass} onClick={() => setMobileOpen(false)}>Blog</NavLink>
                    {user && <NavLink to="/funding" className={navLinkClass} onClick={() => setMobileOpen(false)}>Funding</NavLink>}

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        {!loading && !user && (
                            <div className="flex gap-2">
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg transition-all">
                                    Register
                                </Link>
                            </div>
                        )}
                        {!loading && user && (
                            <div className="space-y-2">
                                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block w-full text-center py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg transition-all">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="block w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 rounded-lg border border-gray-200 dark:border-gray-700 transition-all">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
