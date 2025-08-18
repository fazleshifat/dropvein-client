import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';

export default function SwiperSlider() {
    return (
        <>
            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className="min-h-[540px] cursor-grab"
            >
                <SwiperSlide>
                    <img src="/assets/banner1.jpg" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>


                <SwiperSlide>
                    <img src="/assets/banner2.png" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>


                <SwiperSlide>
                    <img src="/assets/banner3.png" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>



                <SwiperSlide>
                    <img src="/assets/banner4.jpg" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>



              
                <SwiperSlide>
                    <img src="/assets/banner5.jpg" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>


                <SwiperSlide>
                    <img src="/assets/banner6.jpg" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>

    

                <SwiperSlide>
                    <img src="/assets/banner7.jpeg" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>


                <SwiperSlide>
                    <img src="/assets/banner8.png" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>


                <SwiperSlide>
                    <img src="/assets/banner9.jpg" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>



                <SwiperSlide>
                    <img src="/assets/banner10.jpg" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>

                <SwiperSlide>
                    <img src="/assets/banner11.webp" alt="banner" className="min-w-full h-[500px] object-cover" />
                </SwiperSlide>



              





            </Swiper>
        </>
    );
}
