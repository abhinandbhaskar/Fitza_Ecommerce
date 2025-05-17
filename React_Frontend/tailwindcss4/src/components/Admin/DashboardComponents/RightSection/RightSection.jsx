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
import DiscountsOffers from "../DiscountsOffers/DiscountsOffers";
import CouponsSection from "../DiscountsOffers/DiscountComponents/CouponsSection";
import DiscountCardSection from "../DiscountsOffers/DiscountComponents/DiscountCardSection";
import FreeshippingSection from "../DiscountsOffers/DiscountComponents/FreeshippingSection";
import ProductsOfferSection from "../DiscountsOffers/DiscountComponents/ProductsOfferSection";
import FeedBackSection from "../FeedBackSection/FeedBackSection";
import ReturnRefundSection from "../ReturnRefundSection/ReturnRefundSection";
import NotificationSection from "../NotificationSection/NotificationSection";

const RightSection = ({currentView,setCurrentView}) => {
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
      {currentView==="discounts"&&<DiscountsOffers setCurrentView={setCurrentView}/>}
      {currentView==="coupon" && <CouponsSection/>}
      {currentView==="discountcard" && <DiscountCardSection/>}
      {currentView==="freeship"&&<FreeshippingSection/>}
      {currentView==="productoffer"&&<ProductsOfferSection/>}
      {currentView==="feedback"&&<FeedBackSection/>}
      {currentView==="returnrefund"&&<ReturnRefundSection/>}
      {currentView==="notification"&&<NotificationSection/>}

      <Footer/>
        </div>
    );
};

export default RightSection;
