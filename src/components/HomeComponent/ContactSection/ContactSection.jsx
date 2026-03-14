import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';

const ContactSection = () => {
    return (
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
                <Fade triggerOnce>
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Contact <span className="gradient-text">Us</span>
                        </h2>
                        <div className="section-divider mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                            Have questions or want to collaborate? We'd love to hear from you.
                        </p>
                    </div>
                </Fade>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <Fade direction="left" triggerOnce>
                        <div className="space-y-8">
                            <div className="space-y-6">
                                {[
                                    { icon: FaEnvelope, label: 'Email', value: 'info@dropvein.org', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
                                    { icon: FaPhoneAlt, label: 'Phone', value: '+880 1811 112233', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
                                    { icon: FaMapMarkerAlt, label: 'Location', value: '189, Mirsarai, Chittagong, Bangladesh', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 card-hover">
                                        <div className={`p-3 rounded-xl ${item.color}`}>
                                            <item.icon className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{item.label}</p>
                                            <p className="text-gray-800 dark:text-gray-200 font-medium">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Map placeholder */}
                            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.238836508!2d91.5657!3d22.5937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM1JzM3LjMiTiA5McKwMzMnNTYuNSJF!5e0!3m2!1sen!2sbd!4v1"
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    title="Location"
                                ></iframe>
                            </div>
                        </div>
                    </Fade>

                    {/* Contact Form */}
                    <Fade direction="right" triggerOnce>
                        <form className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all text-gray-800 dark:text-gray-200"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Message</label>
                                <textarea
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all resize-none text-gray-800 dark:text-gray-200"
                                    placeholder="Write your message here..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FaPaperPlane className="text-sm" />
                                Send Message
                            </button>
                        </form>
                    </Fade>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
