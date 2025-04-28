import React from "react";
import Footer from "../../Footer/Footer";
import MainSection from "../MainSection/MainSection";
import UsersSection from "../UsersSection/UsersSection";
import SellerSection from "../SellerSection/SellerSection";
import ProductSection from "../ProductSection/ProductSection";
import OrdersSection from "../OrdersSection/OrdersSection";
import RevenueSection from "../RevenueSection/RevenueSection";
import MessageSection from "../MessageSection/MessageSection";
import ComplaintSection from "../ComplaintSection/ComplaintSection";
import ReviewSection from "../ReviewSection/ReviewSection";
import BannerSection from "../BannerSection/BannerSection";

const RightSection = ({currentView}) => {
    return (
        <div className="h-screen w-8/10 bg-white p-4 overflow-y-auto relative ml-77 mt-20">
      {currentView==="mainsection"&&<MainSection/>}
      {currentView==="users"&&<UsersSection/>}
      {currentView==="sellers"&&<SellerSection/>}
      {currentView==="products"&&<ProductSection/>}
      {currentView==="orders"&&<OrdersSection/>}
      {currentView==="revenue"&&<RevenueSection/>}
      {currentView==="messages"&&<MessageSection/>}
      {currentView==="complaints"&&<ComplaintSection/>}
      {currentView==="reviews"&&<ReviewSection/>}
      {currentView==="banner"&&<BannerSection/>}
      <Footer/>
        </div>
    );
};

export default RightSection;
