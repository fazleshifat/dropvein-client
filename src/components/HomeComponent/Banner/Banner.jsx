import React from 'react';
import { Link } from 'react-router';
import SwiperSlider from '../SwiperSlider/SwiperSlider';
import useAuth from '../../../hooks/useAuth';

const Banner = () => {

    const { user } = useAuth();

    return (
        <section className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-12 gap-10 bg-base-100">
            {/* Left Side Text Content */}
            <div className="md:w-1/2 text-center md:text-left space-y-6">
                <h1 className="text-4xl md:text-7xl text-gray-500">
                    Give the Gift of Life <br />
                    <span className="text-gray-500">Donate Blood Today</span>
                </h1>

                <p className="text-gray-600 text-lg">
                    Your contribution can save lives. Join our network of lifesavers or search for a donor in your area.
                </p>

                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-6">
                    {
                        user ? (
                            <Link to="/register">
                                <button className="bg-sky-400 text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg cursor-pointer">
                                    Join as a Donor
                                </button>
                            </Link>
                        ) :
                            (
                                <Link to="/register">
                                    <button className="bg-sky-400 text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg cursor-pointer">
                                        Join as a Donor
                                    </button>
                                </Link>
                            )
                    }

                    <Link to="/search-donors">
                        <button className="bg-base-100 border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg cursor-pointer">
                            Search Donors
                        </button>
                    </Link>
                </div>
            </div>

            {/* Right Side Swiper */}
            <div className="md:w-1/2 w-full">
                <SwiperSlider />
            </div>
        </section>
    );
};

export default Banner;
