import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Select } from 'flowbite-react';
import { NavLink } from 'react-router';
import { MdAddBox } from 'react-icons/md';
import useAxios from '../../../../hooks/useAxios';
import useAuth from '../../../../hooks/UseAuth';
import useUserRole from '../../../../hooks/userUserRole';
import Spinner from '../../../../components/Spinner';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const ContentManagement = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const [filter, setFilter] = useState('all');
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Content Management";
    }, []);


    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['blogs', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-blogs?email=${user?.email}`);
            return res.data;
        }
    });

    // for updating status to publish or un Publish
    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'draft' ? 'published' : 'draft';

        const confirm = await Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${newStatus === 'published' ? 'publish' : 'unpublish'} this blog?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${newStatus}`,
        });

        if (confirm.isConfirmed) {
            updateStatus.mutate({ id, status: newStatus }, {
                onSuccess: () => {
                    Swal.fire('Success!', `Blog is now marked as ${newStatus}.`, 'success');
                },
                onError: () => {
                    Swal.fire('Error!', `Failed to update blog status.`, 'error');
                }
            });
        }
    };

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosSecure.patch(`/blogs/status/${id}`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['blogs', user?.email]);
        }
    });

    // to delete content
    const deleteBlog = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/blogs/delete/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['blogs', user?.email]);

            // ✅ Show success message here
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The blog has been successfully deleted.',
                timer: 1500,
                showConfirmButton: false,
            });
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: 'Could not delete the blog. Please try again.',
            });
        }
    });

    // to handle previous delete functions
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBlog.mutate(id);
            }
        });
    };

    const filteredBlogs = filter === 'all'
        ? blogs
        : blogs.filter(blog => blog.status === filter);

    if (isLoading) {
        return <Spinner></Spinner>;
    }

    return (
        <section className="p-6 bg-base-300 min-h-screen">
            {/* Top Section */}
            <div className="bg-base-100 p-6 rounded-md flex flex-col md:flex-row md:justify-between md:items-center mb-6 shadow">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to Content Management</h1>
                    <p className="text-gray-600">
                        Here you can manage all your blog posts. Filter, publish, unpublish, or delete blogs as needed.
                    </p>
                </div>

                {/*Only for admin adding blog features */}
                {
                    (role === 'admin' || role === 'volunteer') && (
                        <NavLink
                            to='/dashboard/content-management/add-blog'
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            <MdAddBox className="text-lg" /> Add Blog
                        </NavLink>
                    )
                }

            </div>

            {/* Filter */}
            <div className="bg-base-100 p-6 rounded-md shadow">
                <div className="mb-6">
                    <label htmlFor="filter" className="mr-2 font-medium">Filter by Status:</label>
                    <Select
                        id="filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-60"
                    >
                        <option value="all">All</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </Select>
                </div>

                {/* Empty States */}
                {blogs.length === 0 ? (
                    <div className="text-center text-gray-600 text-lg py-10">
                        No blogs have been created yet.
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center text-gray-600 text-lg py-10">
                        No blogs found for <strong>{filter}</strong> filter.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map(blog => (
                            <div key={blog._id} className="flex flex-col justify-between relative border-3 border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-base-100 shadow hover:shadow-lg transition">
                                <img src={blog.thumbnail} alt={blog.title} className="w-full h-40 object-cover rounded mb-3" />
                                <div className='flex justify-between'>
                                    <h3 className="relative text-lg font-bold mb-1">{blog.title}</h3>
                                    <h5 className="bg-base-300 dark:bg-gray-600 p-2 h-fit rounded-2xl text-black dark:text-white text-sm right-5 top-46.5 font-semibold uppercase">{blog.status}</h5>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">By {blog.authorName}</p>
                                <p className="text-sm text-gray-600 mb-1">Email: {blog.authorEmail}</p>
                                <p className="text-sm text-gray-600 mb-1">Date: {new Date(blog.createdAt).toDateString()}</p>
                                <div
                                    className="text-sm text-gray-600 font-semibold bg-base-200 p-3 rounded-lg mb-1"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                                {/* <p className="text-sm text-gray-500 mb-3">Status: <span className="font-semibold uppercase">{blog.status}</span></p> */}

                                {/* Only for admin - Actions of blog */}
                                {
                                    role === 'admin' && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleStatusToggle(blog._id, blog.status)}
                                                className={`px-3 py-1 rounded text-white cursor-pointer ${blog.status === 'draft' ? 'bg-sky-600' : 'bg-sky-600'}`}
                                            >
                                                {blog.status === 'draft' ? 'Publish' : 'Unpublish'}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="px-3 py-1 btn-outline border rounded cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ContentManagement;
