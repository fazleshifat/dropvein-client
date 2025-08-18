import { NavLink, Outlet } from 'react-router';
import {
    MdDashboard, MdLibraryBooks
} from 'react-icons/md';
import {
    FaUsers, FaDonate, FaRegListAlt,
    FaPlusCircle, FaUser
} from 'react-icons/fa';
import DropVeinLogo from '../shared/Logo/DropVeinLogo';
import useUserRole from '../hooks/userUserRole';
import ThemeToggle from '../components/ThemeToggle';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role, isLoading } = useUserRole();

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle peer" />
            <div className="drawer-content flex flex-col peer-checked:overflow-hidden">
                <div className="flex lg:hidden navbar bg-base-200 w-full shadow-sm border-b-2 border-gray-300 dark:border-gray-700">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div className='mx-2 flex-1 text-xl font-bold text-gray-500'> Dashboard</div>
                    </div>
                </div>

                {/* outlet section */}
                <section className='z-10'>
                    <Outlet />
                </section>
            </div>

            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 space-y-2 shadow-lg border-r-5 border-gray-200 dark:border-gray-700">
                    <div className='flex justify-between items-center bg-base-300 dark:bg-gray-700 px-2 py-3 rounded-xl'>
                        <DropVeinLogo />
                        <ThemeToggle />
                    </div>

                    <li>
                        <NavLink
                            to='/dashboard'
                            className={({ isActive }) =>
                                `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                    ? 'bg-sky-400 text-white shadow'
                                    : 'hover:bg-base-200'
                                }`
                            }
                        >
                            <MdDashboard className="text-lg" />
                            Dashboard Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to='/dashboard/profile'
                            className={({ isActive }) =>
                                `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                    ? 'bg-sky-400 text-white shadow'
                                    : 'hover:bg-base-200'
                                }`
                            }
                        >
                            <FaUser className="text-lg" />
                            Profile
                        </NavLink>
                    </li>

                    {/* Admin Routes */}
                    {role === 'admin' && (
                        <>
                            <li>
                                <NavLink
                                    to='/dashboard/my-donation-requests'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaRegListAlt />
                                    My Donation Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/create-donation-request'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaPlusCircle />
                                    Create Donation Request
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/all-users'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaUsers />
                                    All Users
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/all-blood-donation-request'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaDonate />
                                    All Blood Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/content-management'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <MdLibraryBooks />
                                    Content Management
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Donor Routes */}
                    {role === 'donor' && role !== 'admin' && (
                        <>
                            <li>
                                <NavLink
                                    to='/dashboard/my-donation-requests'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaRegListAlt />
                                    My Donation Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/create-donation-request'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaPlusCircle />
                                    Create Donation Request
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Volunteer Routes */}
                    {role === 'volunteer' && (
                        <>
                            <li>
                                <NavLink
                                    to='/dashboard/my-donation-requests'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaRegListAlt />
                                    My Donation Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/create-donation-request'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaPlusCircle />
                                    Create Donation Request
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/all-blood-donation-request'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <FaDonate />
                                    All Blood Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to='/dashboard/content-management'
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition duration-150 ${isActive
                                            ? 'bg-sky-400 text-white shadow'
                                            : 'hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <MdLibraryBooks />
                                    Content Management
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;
