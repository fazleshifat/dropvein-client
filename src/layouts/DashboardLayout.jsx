import { NavLink, Outlet, Link } from 'react-router';
import {
    MdDashboard, MdLibraryBooks
} from 'react-icons/md';
import {
    FaUsers, FaDonate, FaRegListAlt,
    FaPlusCircle, FaUser, FaInbox, FaSignOutAlt, FaHome
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
            <div className="min-h-screen flex justify-center items-center bg-base-100 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-red-500"></span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const linkClass = ({ isActive }) =>
        `sidebar-link flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
            ? 'active bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/20'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'
        }`;

    const SidebarSection = ({ title, children }) => (
        <div className="space-y-1">
            <p className="px-4 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{title}</p>
            {children}
        </div>
    );

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle peer" />

            {/* Main Content */}
            <div className="drawer-content flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen peer-checked:overflow-hidden">
                {/* Mobile Header */}
                <div className="flex lg:hidden items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <label htmlFor="my-drawer-2" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Dashboard</span>
                    <ThemeToggle />
                </div>

                {/* Outlet Section */}
                <section className="z-10 flex-1">
                    <Outlet />
                </section>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <aside className="flex flex-col bg-white dark:bg-gray-800 min-h-full w-72 border-r border-gray-200 dark:border-gray-700">
                    {/* Logo Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <DropVeinLogo />
                        <ThemeToggle />
                    </div>

                    {/* User Info */}
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-red-200 dark:ring-red-800">
                                <img src={user?.photoURL} alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.displayName}</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                    {role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-2">
                        <SidebarSection title="Overview">
                            <li className="list-none"><NavLink to='/dashboard' end className={linkClass}><MdDashboard className="text-lg" /> Dashboard Home</NavLink></li>
                            <li className="list-none"><NavLink to='/dashboard/profile' className={linkClass}><FaUser className="text-lg" /> Profile</NavLink></li>
                        </SidebarSection>

                        <SidebarSection title="Donations">
                            <li className="list-none"><NavLink to='/dashboard/my-donation-requests' className={linkClass}><FaRegListAlt className="text-base" /> My Donation Requests</NavLink></li>
                            <li className="list-none"><NavLink to='/dashboard/create-donation-request' className={linkClass}><FaPlusCircle className="text-base" /> Create Request</NavLink></li>
                        </SidebarSection>

                        {/* Admin Only */}
                        {role === 'admin' && (
                            <SidebarSection title="Administration">
                                <li className="list-none"><NavLink to='/dashboard/all-users' className={linkClass}><FaUsers className="text-base" /> All Users</NavLink></li>
                                <li className="list-none"><NavLink to='/dashboard/all-blood-donation-request' className={linkClass}><FaDonate className="text-base" /> All Blood Requests</NavLink></li>
                                <li className="list-none"><NavLink to='/dashboard/content-management' className={linkClass}><MdLibraryBooks className="text-base" /> Content Management</NavLink></li>
                                <li className="list-none"><NavLink to='/dashboard/inbox' className={linkClass}><FaInbox className="text-base" /> Inbox</NavLink></li>
                            </SidebarSection>
                        )}

                        {/* Volunteer Only */}
                        {role === 'volunteer' && (
                            <SidebarSection title="Management">
                                <li className="list-none"><NavLink to='/dashboard/all-blood-donation-request' className={linkClass}><FaDonate className="text-base" /> All Blood Requests</NavLink></li>
                                <li className="list-none"><NavLink to='/dashboard/content-management' className={linkClass}><MdLibraryBooks className="text-base" /> Content Management</NavLink></li>
                            </SidebarSection>
                        )}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-700 space-y-1">
                        <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                            <FaHome className="text-base" /> Back to Home
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;
