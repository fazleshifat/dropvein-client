import { Fade } from "react-awesome-reveal";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";

const featuredItems = [
    {
        id: 1,
        title: "Blood Donation Awareness",
        image: "/assets/banner1.jpg",
        description: "Engaging programs that educate the public about the importance of regular blood donation.",
        color: "from-red-500 to-rose-600",
    },
    {
        id: 2,
        title: "Emergency Response Drives",
        image: "/assets/banner2.png",
        description: "Swift community mobilization during urgent needs and disasters.",
        color: "from-orange-500 to-red-600",
    },
    {
        id: 3,
        title: "Health Check-Up Camps",
        image: "/assets/banner3.png",
        description: "Free health screening and consultations organized in underserved areas.",
        color: "from-emerald-500 to-teal-600",
    },
    {
        id: 4,
        title: "Donor Appreciation Events",
        image: "/assets/banner4.jpg",
        description: "Recognizing and celebrating our heroes who save lives by donating.",
        color: "from-violet-500 to-purple-600",
    },
    {
        id: 5,
        title: "Youth Volunteering Programs",
        image: "/assets/banner5.jpg",
        description: "Empowering the younger generation to lead blood donation awareness campaigns.",
        color: "from-blue-500 to-indigo-600",
    },
    {
        id: 6,
        title: "Mobile Donation Units",
        image: "/assets/banner6.jpg",
        description: "Reaching remote areas to collect and provide lifesaving blood supply.",
        color: "from-pink-500 to-rose-600",
    },
];

const FeaturedSection = () => {
    return (
        <section className="py-20 px-5 bg-base-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <Fade cascade damping={0.1} triggerOnce>
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
                            What We Do
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Featured <span className="gradient-text">Services</span>
                        </h2>
                        <div className="section-divider mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Discover our comprehensive range of services designed to save lives and build a stronger donor community.
                        </p>
                    </div>
                </Fade>

                <Fade cascade damping={0.08} triggerOnce>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {featuredItems.map(item => (
                            <div
                                key={item.id}
                                className="group bg-base-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 card-hover"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-medium shadow-lg`}>
                                            Learn More <FaArrowRight className="text-[10px]" />
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                        {item.description}
                                    </p>
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:gap-3 transition-all duration-300"
                                    >
                                        Explore <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </Fade>
            </div>
        </section>
    );
};

export default FeaturedSection;
