import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Spinner from '../../components/Spinner';

const Blogs = () => {
    const axios = useAxios();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Blogs";
    }, []);

    const { data: blogs = [], isLoading, isError } = useQuery({
        queryKey: ['publishedBlogs'],
        queryFn: async () => {
            const res = await axios.get('/all-blogs/public');
            return res.data;
        }
    });

    if (isLoading) {
        return <Spinner></Spinner>;
    }

    if (isError) {
        return <div className="text-center text-red-500 py-8">Failed to load blogs.</div>;
    }

    if (blogs.length === 0) {
        return <div className="text-center text-gray-600 text-lg py-10">No published blogs available.</div>;
    }

    return (
        <section className="p-6 min-h-[90vh]">
            <div className="p-6 rounded-md">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-500">Blogs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog._id} className="flex flex-col justify-between relative border-3 border-gray-200 rounded-lg p-4 bg-base-100 shadow hover:shadow-lg transition">
                            <img src={blog.thumbnail} alt={blog.title} className="w-full h-40 object-cover rounded mb-3" />
                            <h3 className="text-lg font-bold mb-1">{blog.title}</h3>
                            <span className="absolute bg-base-300 p-2 rounded-2xl text-gray-600 dark:bg-gray-400 text-sm right-5 top-46.5 font-semibold uppercase">{blog.status}</span>
                            <p className="text-sm text-gray-600 mb-1">By {blog.authorName}</p>
                            <p className="text-sm text-gray-600 mb-1">Email: {blog.authorEmail}</p>
                            <p className="text-sm text-gray-600 mb-1">Date: {new Date(blog.createdAt).toDateString()}</p>
                            <div
                                className="text-sm text-gray-600 font-semibold bg-base-200 p-3 rounded-lg mb-2"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                            <div className="mt-2 text-right">
                                <Link to={`/blogs/${blog._id}`}>
                                    <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">
                                        View
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blogs;
