import { Fade } from "react-awesome-reveal";
import { Link } from "react-router";

const featuredItems = [
    {
        id: 1,
        title: "Blood Donation Awareness",
        image: "/assets/banner1.jpg",
        description: "Engaging programs that educate the public about the importance of regular blood donation.",
    },
    {
        id: 2,
        title: "Emergency Response Drives",
        image: "/assets/banner2.png",
        description: "Swift community mobilization during urgent needs and disasters.",
    },
    {
        id: 3,
        title: "Health Check-Up Camps",
        image: "/assets/banner3.png",
        description: "Free health screening and consultations organized in underserved areas.",
    },
    {
        id: 4,
        title: "Donor Appreciation Events",
        image: "/assets/banner4.jpg",
        description: "Recognizing and celebrating our heroes who save lives by donating.",
    },
    {
        id: 5,
        title: "Youth Volunteering Programs",
        image: "/assets/banner5.jpg",
        description: "Empowering the younger generation to lead blood donation awareness campaigns.",
    },
    {
        id: 6,
        title: "Mobile Donation Units",
        image: "/assets/banner6.jpg",
        description: "Reaching remote areas to collect and provide lifesaving blood supply.",
    },
];

const FeaturedSection = () => {
    return (
        <div className="max-w-[1300px] mx-auto rounded-3xl py-12 px-5 flex flex-col justify-center">
            <Fade cascade damping={0.1}>
                <h2 className="text-6xl font-md text-center text-gray-500 mb-10">
                    Featured Services
                </h2>
            </Fade>

            <Fade cascade damping={0.1}>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {featuredItems.map(item => (
                        <div
                            key={item.id}
                            className="bg-base-200 rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-52 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-gray-600 mb-2">{item.title}</h3>
                                <p className="text-gray-700 mb-4">{item.description}</p>
                                <Link
                                    to="/dashboard"
                                    className="bg-sky-400 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </Fade>
        </div>
    );
};

export default FeaturedSection;
