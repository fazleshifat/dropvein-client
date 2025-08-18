import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../../components/ThemeToggle';

const Navbar = () => {
    const { user, loading, userLogOut } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, logout',
        }).then((result) => {
            if (result.isConfirmed) {
                userLogOut();
                setDropdownOpen(false);
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

    const links = (
        <>
            <li><Link to="/" className="hover:text-red-600">Home</Link></li>
            <li><Link to="/blood-donation-requests" className="hover:text-red-600">Donation Requests</Link></li>
            <li><Link to="/blogs" className="hover:text-red-600">Blog</Link></li>
            {user && <li><Link to="/funding" className="hover:text-red-600">Funding</Link></li>}
        </>
    );

    return (
        <nav className="w-full sticky top-0 z-50 bg-base-100 shadow-sm transition-all dark:border-b-2 border-gray-600">
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left Section: Logo + Mobile Menu */}
                <div className="flex items-center md:space-x-4">
                    {/* Mobile Dropdown */}
                    <div className="dropdown md:hidden">
                        <button
                            tabIndex={0}
                            className="btn btn-ghost p-2"
                            onClick={() => setDropdownOpen(true)}
                        >
                            <FaBars className="text-xl" />
                        </button>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {links}
                        </ul>
                    </div>

                    {/* Logo */}
                    <Link to="/" className="flex items-center -space-x-1 md:space-x-0">
                        <img
                            src="/assets/login.png"
                            alt="Logo"
                            className="w-10 h-10 object-contain rounded-full"
                        />
                        <h1 className="text-2xl font-bold text-gray-500">Dropvein</h1>
                    </Link>
                </div>

                {/* Center Section: Desktop Nav Links */}
                <div className="hidden md:flex justify-center flex-1">
                    <ul className="px-1 gap-4 font-semibold text-gray-500 flex">{links}</ul>
                </div>

                {/* Right Section: Theme + Auth */}
                <div className="flex items-center md:gap-3">
                    <ThemeToggle />
                    {!loading && (
                        <>
                            {!user ? (
                                <div className="flex gap-1 md:gap-2">
                                    <Link
                                        to="/login"
                                        className="btn btn-sm bg-sky-500 text-white hover:bg-sky-600 rounded-lg"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-sm border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        className="btn btn-ghost btn-circle avatar"
                                    >
                                        <div className="w-10 rounded-full overflow-hidden">
                                            <img src={user?.photoURL} alt="User" />
                                        </div>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu menu-sm dropdown-content mt-3 p-3 bg-base-300 rounded-box shadow-lg w-44 md:w-52 z-[1]"
                                    >
                                        <li className="font-semibold text-center text-base truncate">
                                            {user?.displayName}
                                        </li>
                                        <Link
                                            to="/dashboard"
                                            className="btn bg-sky-500 text-white w-full mt-2 text-sm"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-outline text-gray-500 w-full mt-2 text-sm"
                                        >
                                            Logout
                                        </button>
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
