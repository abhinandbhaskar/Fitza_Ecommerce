import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BannerSection.css"
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {safe} from "../../../utils/safeAccess";

const BannerSection = () => {
  const [banner, setBanner] = useState([]);
  const navigate=useNavigate();

  const handleShopNow=()=>{
     if(!accessToken || accessToken.length === 0) {
            toast.error("You need to login first!");
            return;
        }
    navigate("/offerproduct");
  }

  const { accessToken } = useSelector((state) => state.auth);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(
        "https://127.0.0.1:8000/api/getbanners/",{});
      setBanner(response.data);
    } catch (errors) {
      console.error("Error fetching banners:", errors);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        spaceBetween={30}
        slidesPerView={1}
        className="w-full h-screen" // Updated height
      >
        {banner.map((value, key) => (
          <SwiperSlide key={key}>
            <div
              className="banner-container flex items-center justify-center bg-cover bg-center h-screen text-white"
              style={{
                backgroundImage: `url(${
                    "https://127.0.0.1:8000/" + safe(value,'image') || "/src/assets/MainBanner/MainBanner.jpg"
                })`,
            }}
            >
      <div className="banner-content">
        <div className="left-section">
          <h1 className="banner-title">{safe(value,'title')||"Spring Sale is Here!"}</h1>
          <p className="banner-description">
            {safe(value,'description')||"Celebrate the season with fresh styles and vibrant colors. Limited stock available!"}
          </p>
          <h4 className="banner-offer">{safe(value,'offer_details')||"Flat 30% off on all dresses."}</h4>
          <div className="banner-dates">
            <span><strong>Start Date : </strong>
                 {format(new Date(safe(value,'start_date')), "MMMM d, yyyy ") || " 2025-04-01"}
            
            </span>
            <span><strong>End Date : </strong> 
                 {format(new Date(safe(value,'start_date')), "MMMM d, yyyy ") || " 2025-04-01"}
            </span>
          </div>
          <button onClick={()=>handleShopNow()} className="shop-now-btn">
            SHOP NOW
          </button>
        </div>
      </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <ToastContainer />    
    </div>
  );
};

export default BannerSection;



