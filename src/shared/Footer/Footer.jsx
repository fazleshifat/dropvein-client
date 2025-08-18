import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router';
import DropVeinLogo from '../Logo/DropVeinLogo';

const Footer = () => {
    return (
        <footer className="bg-base-300 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">

                {/* Branding */}
                <div className='flex flex-col items-start'>
                    <DropVeinLogo></DropVeinLogo>
                    <p className="text-sm">
                        Saving lives, one drop at a time. Join the life-saving mission today.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-red-400 transition">Home</Link></li>
                        <li><Link to="/search-donors" className="hover:text-red-400 transition">Search Donors</Link></li>
                        <li><Link to="/register" className="hover:text-red-400 transition">Join as Donor</Link></li>
                        {/* <li><Link to="/about" className="hover:text-red-400 transition">About Us</Link></li> */}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">Contact Us</h3>
                    <ul className="text-sm space-y-1">
                        <li>Email: info@dropvein.org</li>
                        <li>Phone: +880 1234 567 890</li>
                        <li>Location: Chittagong, Bangladesh</li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">Follow Us</h3>
                    <div className="flex space-x-4 text-lg">
                        <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
                        <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
                        <a href="#" className="hover:text-sky-400 transition"><FaTwitter /></a>
                        <a href="#" className="hover:text-blue-400 transition"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} DropVein. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
