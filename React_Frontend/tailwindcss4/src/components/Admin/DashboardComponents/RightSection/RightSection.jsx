import React from "react";
import Footer from "../../Footer/Footer";
import MainSection from "../MainSection/MainSection";
import UsersSection from "../UsersSection/UsersSection";
import SellerSection from "../SellerSection/SellerSection";
import ProductSection from "../ProductSection/ProductSection";
import OrdersSection from "../OrdersSection/OrdersSection";
import RevenueSection from "../RevenueSection/RevenueSection";
import ComplaintSection from "../ComplaintSection/ComplaintSection";
import ReviewSection from "../ReviewSection/ReviewSection";
import BannerSection from "../BannerSection/BannerSection";
import DiscountsOffers from "../DiscountsOffers/DiscountsOffers";
import CouponsSection from "../DiscountsOffers/DiscountComponents/CouponsSection";
import DiscountCardSection from "../DiscountsOffers/DiscountComponents/DiscountCardSection";
import FreeshippingSection from "../DiscountsOffers/DiscountComponents/FreeshippingSection";
import ProductsOfferSection from "../DiscountsOffers/DiscountComponents/ProductsOfferSection";
import FeedBackSection from "../FeedBackSection/FeedBackSection";
import ReturnRefundSection from "../ReturnRefundSection/ReturnRefundSection";
import NotificationSection from "../NotificationSection/NotificationSection";

const RightSection = ({currentView,setCurrentView,setCountN,searchTerm}) => {
    return (
      <div className="h-screen w-8/10 bg-white p-4 overflow-y-auto relative ml-77 mt-20">
      {currentView==="mainsection"&&<MainSection setCurrentView={setCurrentView}/>}
      {currentView==="users"&&<UsersSection setCurrentView={setCurrentView} searchTerm={searchTerm}/>}
      {currentView==="sellers"&&<SellerSection searchTerm={searchTerm}/>}
      {currentView==="products"&&<ProductSection searchTerm={searchTerm} setCurrentView={setCurrentView}/>}
      {currentView==="orders"&&<OrdersSection/>}
      {currentView==="revenue"&&<RevenueSection setCurrentView={setCurrentView}/>}
      {currentView==="complaints"&&<ComplaintSection setCurrentView={setCurrentView}/>}
      {currentView==="reviews"&&<ReviewSection setCurrentView={setCurrentView}/>}
      {currentView==="banner"&&<BannerSection setCurrentView={setCurrentView}/>}
      {currentView==="discounts"&&<DiscountsOffers setCurrentView={setCurrentView}/>}
      {currentView==="coupon" && <CouponsSection setCurrentView={setCurrentView}/>}
      {currentView==="discountcard" && <DiscountCardSection setCurrentView={setCurrentView}/>}
      {currentView==="freeship"&&<FreeshippingSection setCurrentView={setCurrentView}/>}
      {currentView==="productoffer"&&<ProductsOfferSection setCurrentView={setCurrentView}/>}
      {currentView==="feedback"&&<FeedBackSection setCurrentView={setCurrentView}/>}
      {currentView==="returnrefund"&&<ReturnRefundSection setCurrentView={setCurrentView}/>}
      {currentView==="notification"&&<NotificationSection setCountN={setCountN} />}

      <Footer/>
        </div>
    );
};

export default RightSection;
