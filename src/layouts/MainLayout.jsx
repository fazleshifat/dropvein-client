import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../shared/Navbar/Navbar';
import Footer from '../shared/Footer/Footer';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <section className='min-h-screen'>
                <Outlet></Outlet>
            </section>

            <Footer></Footer>
        </div>
    );
};

export default MainLayout;