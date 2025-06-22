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
import { safe } from "../../../utils/safeAccess";

const BannerSection = () => {
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleShopNow = () => {
    if (!accessToken || accessToken.length === 0) {
      toast.error("You need to login first!");
      return;
    }
    navigate("/offerproduct");
  }

  const { accessToken } = useSelector((state) => state.auth);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://127.0.0.1:8000/api/getbanners/", {});
      setBanner(response.data);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          {/* Double ring spinner */}
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium"></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load banners</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchBanner}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        className="w-full h-screen"
      >
        {banner.map((value, key) => (
          <SwiperSlide key={key}>
            <div
              className="banner-container flex items-center justify-center bg-cover bg-center h-screen text-white"
              style={{
                backgroundImage: `url(${
                  "https://127.0.0.1:8000/" + safe(value, 'image') || "/src/assets/MainBanner/MainBanner.jpg"
                })`,
              }}
            >
              <div className="banner-content">
                <div className="left-section">
                  <h1 className="banner-title">{safe(value, 'title') || "Spring Sale is Here!"}</h1>
                  <p className="banner-description">
                    {safe(value, 'description') || "Celebrate the season with fresh styles and vibrant colors. Limited stock available!"}
                  </p>
                  <h4 className="banner-offer">{safe(value, 'offer_details') || "Flat 30% off on all dresses."}</h4>
                  <div className="banner-dates">
                    <span><strong>Start Date : </strong>
                      {format(new Date(safe(value, 'start_date')), "MMMM d, yyyy ") || " 2025-04-01"}
                    </span>
                    <span><strong>End Date : </strong>
                      {format(new Date(safe(value, 'start_date')), "MMMM d, yyyy ") || " 2025-04-01"}
                    </span>
                  </div>
                  <button onClick={() => handleShopNow()} className="shop-now-btn">
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


