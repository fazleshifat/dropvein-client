import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/userUserRole';

const ForbiddenPage = () => {

    const { user } = useAuth();
    const { role } = useUserRole();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Forbidden";
    }, []);


    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-md bg-base-100 shadow-xl rounded-2xl p-8 border-t-4 border-red-500">
                <div className="text-red-500 text-5xl mb-4 flex justify-center">
                    <FaLock />
                </div>
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-lg mt-4">You need {role} privileges to access this page.</p>
                <Link to="/" className="btn btn-outline rounded-full">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ForbiddenPage;