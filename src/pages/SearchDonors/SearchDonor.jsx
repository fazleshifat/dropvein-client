import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const SearchDonors = () => {
    const { setLoading } = useAuth();
    const axiosSecure = useAxios();

    const [donors, setDonors] = useState([]);
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [searched, setSearched] = useState(false);

    const { districts, upazilas } = useLoaderData();

    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedUpazila, setSelectedUpazila] = useState('');
    const [selectedBlood, setSelectedBlood] = useState('');
    const [districtName, setDistrictName] = useState('');

    const filteredUpazilas = upazilas.filter(u => u.district_id == selectedDistrict);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Dropvein | Donors';

        axiosSecure.get('/active-donors')
            .then(res => {
                setDonors(res.data);
                setFilteredDonors(res.data); // default to all for 'See All Donors'
            })
            .finally(() => setLoading(false));
    }, [axiosSecure]);

    useEffect(() => {
        if (selectedDistrict) {
            const districtObj = districts.find(d => d.id == selectedDistrict);
            setDistrictName(districtObj?.name || '');
        }
    }, [selectedDistrict, districts]);

    // Reset donors from UI if all fields are cleared
    useEffect(() => {
        const allEmpty = !selectedBlood && !selectedDistrict && !selectedUpazila;
        if (allEmpty && searched) {
            setFilteredDonors([]);
            setSearched(false);
        }
    }, [selectedBlood, selectedDistrict, selectedUpazila, searched]);

    const handleSearch = () => {
        setSearched(true);

        const result = donors.filter(donor => {
            const matchesBlood = selectedBlood ? donor.blood_group === selectedBlood : true;
            const matchesDistrict = selectedDistrict ? donor.district === districtName : true;
            const matchesUpazila = selectedUpazila ? donor.upazila === selectedUpazila : true;

            return matchesBlood && matchesDistrict && matchesUpazila;
        });

        setFilteredDonors(result);
    };

    const handleSeeAll = () => {
        setSearched(true);
        setFilteredDonors(donors);
    };

    const isSearchDisabled = !selectedBlood && !selectedDistrict && !selectedUpazila;

    return (
        <div className="min-h-[90vh] py-10 px-4 md:px-10 bg-base-100">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-8">Search Blood Donors</h1>

            {/* Search Form */}
            <div className="max-w-7xl mx-auto bg-base-300 shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block font-semibold mb-1">Blood Group</label>
                    <select
                        onChange={(e) => setSelectedBlood(e.target.value)}
                        className="select select-bordered w-full"
                        defaultValue=""
                    >
                        <option value="">Select</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">District</label>
                    <select
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="select select-bordered w-full"
                        defaultValue=""
                    >
                        <option value="">Select</option>
                        {districts.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Upazila</label>
                    <select
                        onChange={(e) => setSelectedUpazila(e.target.value)}
                        className="select select-bordered w-full"
                        disabled={!selectedDistrict}
                        defaultValue=""
                    >
                        <option value="">Select</option>
                        {filteredUpazilas.map(u => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Buttons */}
            <div className="text-center mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleSearch}
                    disabled={isSearchDisabled}
                    className={`px-6 py-3 rounded-full shadow-md font-semibold transition ${isSearchDisabled
                        ? 'bg-gray-300 cursor-not-allowed text-white'
                        : 'bg-sky-400 cursor-pointer hover:bg-sky-400 text-white'
                        }`}
                >
                    Search Donors
                </button>

                {searched && (
                    <button
                        onClick={handleSeeAll}
                        className="hidden bg-base-100 border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white px-6 py-3 rounded-full font-semibold transition shadow-md cursor-pointer"
                    >
                        See All Donors
                    </button>
                )}
            </div>

            {/* Results */}
            <div className="max-w-full mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!searched ? (
                    <p className="col-span-full text-center text-gray-500 text-lg">
                        Search our donors based on your need.
                    </p>
                ) : filteredDonors.length === 0 ? (
                    <p className="col-span-full text-center text-red-500 text-lg">
                        No donors found.
                    </p>
                ) : (
                    filteredDonors.map(donor => (
                        <div key={donor._id} className="bg-base-100 shadow-xl p-4 rounded-2xl text-center border-2 border-gray-200">
                            <img
                                src={donor.photoURL}
                                alt={donor.name}
                                className="w-24 h-24 object-cover mx-auto rounded-full mb-4 border-2 border-red-400"
                            />
                            <h3 className="text-xl font-semibold text-gray-600">
                                <span className="font-semibold">{donor.name}</span>
                            </h3>
                            <p className="text-sm text-gray-600">
                                Blood Group: <span className="font-extrabold text-red-500">{donor.blood_group}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Location: <span className="font-semibold">{donor.upazila}, {donor.district}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Email: <span className="font-semibold">{donor.email}</span>
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchDonors;
