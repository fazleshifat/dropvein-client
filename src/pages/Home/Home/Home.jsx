import React, { useEffect } from 'react';
import Banner from '../../../components/HomeComponent/Banner/Banner';
import FeaturedSection from '../../../components/HomeComponent/FeaturedSection/FeaturedSection';
import ContactSection from '../../../components/HomeComponent/ContactSection/ContactSection';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Dropvein | Home";
    }, []);
    return (
        <>
            <section>
                <Banner></Banner>
                <FeaturedSection></FeaturedSection>
                <ContactSection></ContactSection>
            </section>
        </>
    );
};

export default Home;