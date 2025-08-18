import React, { use } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import useAuth from '../../../hooks/useAuth';

const ContactSection = () => {
    const { user } = useAuth();

    return (
        <div className="py-12 px-6 bg-white overflow-x-hidden dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <Fade direction="left" triggerOnce={false}>
                    <div>
                        <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Contact Us</h2>
                        <p className="text-gray-500 mb-6 text-base leading-relaxed">
                            We’d love to hear from you. Please reach out with your questions, feedback, or collaboration opportunities.
                        </p>

                        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-base">
                            <div className="flex items-center gap-4">
                                <FaEnvelope className="text-xl text-gray-500" />
                                <span>{'info@dropvein.org'}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaPhoneAlt className="text-xl text-gray-500" />
                                <span>+880 1811 112233</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaMapMarkerAlt className="text-xl text-gray-500" />
                                <span>189, Mirsarai, Chittagong, Bangladesh</span>
                            </div>
                        </div>
                    </div>
                </Fade>

                {/* Contact Form */}
                <Fade direction="right" triggerOnce={false}>
                    <form className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="type your name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Your Message</label>
                            <textarea
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Write your message here..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                        >
                            Submit Message
                        </button>
                    </form>
                </Fade>
            </div>
        </div>
    );
};

export default ContactSection;
