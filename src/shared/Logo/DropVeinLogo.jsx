import React from 'react';
import { Link } from 'react-router';

const DropVeinLogo = () => {
    return (
        <>
            <Link to='/'>
                <div className='flex items-end justify-center gap-3'>
                    <img src="/assets/login.png" className='w-10 rounded-full' alt="logo" />
                    <p className='text-3xl text-gray-500 font-bold -ml-3'>Dropvein</p>
                </div>
            </Link>
        </>
    );
};

export default DropVeinLogo;