import React, { useEffect, useState } from 'react';
import { FaUserShield, FaTrash } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import useAxios from '../../../../hooks/useAxios';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Spinner from '../../../../components/Spinner';

const USERS_PER_PAGE = 10;

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get('/users')
            .then(res => setUsers(res.data))
            .finally(() => setLoading(false));
    }, [axiosSecure]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | All User";
    }, []);

    // ✅ Block
    const handleBlock = async (user) => {
        const result = await Swal.fire({
            title: 'Block this user?',
            text: `Are you sure you want to block ${user.name || 'this user'}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, block',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/status/${user._id}`, { status: 'blocked' });
                if (res.data.modifiedCount > 0) {
                    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: 'blocked' } : u));
                    Swal.fire('Blocked!', 'User has been blocked.', 'success');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to block user.', 'error');
            }
        }
    };

    // ✅ Unblock
    const handleUnblock = async (user) => {
        const result = await Swal.fire({
            title: 'Unblock this user?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, unblock',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/status/${user._id}`, { status: 'active' });
                if (res.data.modifiedCount > 0) {
                    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: 'active' } : u));
                    Swal.fire('Unblocked!', 'User is now active.', 'success');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to unblock user.', 'error');
            }
        }
    };

    // ✅ Make Donor
    const handleMakeDonor = async (user) => {
        const result = await Swal.fire({
            title: 'Change role to Donor?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, make donor',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/role/${user._id}`, { role: 'donor' });
                if (res.data.modifiedCount > 0) {
                    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: 'donor' } : u));
                    Swal.fire('Updated!', 'User is now a donor.', 'success');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to update role.', 'error');
            }
        }
    };

    // ✅ Make Volunteer
    const handleMakeVolunteer = async (user) => {
        const result = await Swal.fire({
            title: 'Change role to Volunteer?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, make volunteer',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/role/${user._id}`, { role: 'volunteer' });
                if (res.data.modifiedCount > 0) {
                    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: 'volunteer' } : u));
                    Swal.fire('Updated!', 'User is now a volunteer.', 'success');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to update role.', 'error');
            }
        }
    };

    // ✅ Make Admin
    const handleMakeAdmin = async (user) => {
        const result = await Swal.fire({
            title: 'Make this user an Admin?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, make admin',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/role/${user._id}`, { role: 'admin' });
                if (res.data.modifiedCount > 0) {
                    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: 'admin' } : u));
                    Swal.fire('Updated!', 'User is now an admin.', 'success');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to update role.', 'error');
            }
        }
    };



    const handleDelete = async (userId) => {
        const result = await Swal.fire({
            title: 'Sure? to delete the user',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/users/${userId}`);
                if (res.data.deletedCount > 0) {
                    setUsers(users.filter(user => user._id !== userId));
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    // Pagination logic
    const filteredUsers = users.filter(user =>
        filterStatus === 'all' ? true : user.status === filterStatus
    );
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const startIdx = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIdx, startIdx + USERS_PER_PAGE);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    if (loading) {
        return <Spinner></Spinner>;
    }

    // ... All your existing handlers like handleBlock, handleDelete, etc. stay unchanged

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="relative z-0 min-w-10/12 h-[90vh] mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl overflow-x-auto">
                <h2 className="text-2xl font-md mb-6 text-center text-gray-500">
                    All Users
                </h2>
                <div className="flex justify-end mb-4">
                    <select
                        className="select select-bordered w-48"
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1); // reset to page 1 when filter changes
                        }}
                    >
                        <option value="all">All Users</option>
                        <option value="active">Active Users</option>
                        <option value="blocked">Blocked Users</option>
                    </select>
                </div>
                <table className="min-w-full table-auto text-left text-sm">
                    <thead>
                        <tr className="bg-sky-300 text-white">
                            <th className="p-3">#</th>
                            <th className="p-3">Avatar</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Update Role</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user._id} className="border-b dark:border-gray-700">
                                <td className="p-3">{startIdx + index + 1}</td>
                                <td className="p-3">
                                    <img src={user?.photoURL} className='w-12 h-12 rounded-full' alt="" />
                                </td>
                                <td className="p-3">{user.name || 'N/A'}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3 capitalize">
                                    <span className={`p-3 capitalize rounded 
                                        ${user.role === 'admin' ? 'bg-green-500 text-white font-semibold' :
                                            user.role === 'volunteer' ? 'bg-blue-500 text-white font-medium' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {user.role || 'donor'}
                                    </span>
                                </td>
                                <td className="p-3 capitalize font-bold">{user.status || 'inactive'}</td>
                                <td className="p-3 text-center">
                                    <div className="dropdown dropdown-end">
                                        <button tabIndex={0} className="text-3xl cursor-pointer">
                                            <BsThreeDots />
                                        </button>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                        >
                                            {user.status === "active" && (
                                                <li>
                                                    <button
                                                        className="text-red-600"
                                                        onClick={() => handleBlock(user)}
                                                    >
                                                        🚫 Block User
                                                    </button>
                                                </li>
                                            )}

                                            {user.status === "blocked" && (
                                                <li>
                                                    <button
                                                        className="text-green-600"
                                                        onClick={() => handleUnblock(user)}
                                                    >
                                                        ✅ Unblock User
                                                    </button>
                                                </li>
                                            )}

                                            {user.role === "donor" && (
                                                <li>
                                                    <button
                                                        className="text-blue-600"
                                                        onClick={() => handleMakeVolunteer(user)}
                                                    >
                                                        🤝 Make Volunteer
                                                    </button>
                                                </li>
                                            )}

                                            {(user.role === "donor" || user.role === "volunteer") && (
                                                <>
                                                    <li>
                                                        <button
                                                            className="text-purple-600"
                                                            onClick={() => handleMakeAdmin(user)}
                                                        >
                                                            👑 Make Admin
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="text-purple-600"
                                                            onClick={() => handleMakeDonor(user)}
                                                        >
                                                            🩸 Make Donor
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                            {(user.role === "admin") && (
                                                <>
                                                    <li>
                                                        <button
                                                            className="text-purple-600"
                                                            onClick={() => handleMakeDonor(user)}
                                                        >
                                                            🩸 Make Donor
                                                        </button>
                                                        <button
                                                            className="text-blue-600"
                                                            onClick={() => handleMakeVolunteer(user)}
                                                        >
                                                            🤝 Make Volunteer
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </td>
                                <td className="p-3 text-center flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn text-red-600 text-lg rounded-full hover:underline"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center text-gray-600 dark:text-gray-300 py-6">
                        No users found.
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
                        <button
                            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {[...Array(totalPages).keys()].map(n => (
                            <button
                                key={n}
                                onClick={() => changePage(n + 1)}
                                className={`px-3 py-1 rounded ${currentPage === n + 1 ? 'bg-sky-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                            >
                                {n + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;
