import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Spinner from '../../components/Spinner';

const BlogDetails = () => {
    const { id } = useParams();
    const axios = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: blog, isLoading, isError } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            const res = await axios.get(`/blogs/${id}`);
            return res.data;
        },
        onError: () => {
            // Redirect if blog not found or error
            navigate('/blogs');
        }
    });

    useEffect(() => {
        if (blog) {
            document.title = `Dropvein | ${blog.title}`;
        }
    }, [blog]);

    if (isLoading) {
        return <Spinner></Spinner>;
    }

    if (isError || !blog) {
        return <div className="text-center text-red-500 py-8">Failed to load blog details.</div>;
    }

    return (
        <section className="p-6 bg-base-100 min-h-[90vh]">
            <div className="bg-base-200 p-6 rounded-md shadow max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                <p className="text-gray-600 mb-1">By <strong>{blog.authorName}</strong> ({blog.authorEmail})</p>
                <p className="text-gray-600 mb-4">Published on: {new Date(blog.createdAt).toLocaleDateString()}</p>

                <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full object-cover rounded mb-6"
                />

                <article
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <div className="mt-6">
                    <span className="inline-block bg-warning text-white px-3 py-1 rounded-full uppercase font-semibold">
                        {blog.status}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default BlogDetails;
