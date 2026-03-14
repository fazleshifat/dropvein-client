import React from 'react';
import { Link } from 'react-router';

const DropVeinLogo = () => {
    return (
        <Link to='/' className="flex items-center gap-2 group">
            <img
                src="/assets/login.png"
                className="w-9 h-9 rounded-full ring-2 ring-red-100 dark:ring-red-900/40 group-hover:ring-red-300 dark:group-hover:ring-red-700 transition-all"
                alt="logo"
            />
            <span className="text-xl font-bold tracking-tight">
                <span className="text-gray-800 dark:text-gray-100">Drop</span>
                <span className="gradient-text">vein</span>
            </span>
        </Link>
    );
};

export default DropVeinLogo;
