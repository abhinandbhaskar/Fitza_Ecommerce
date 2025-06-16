import React, { useState } from "react";
import Footer from "../../Footer/Footer";
import MainSection from "../MainSection/MainSection";
import UsersSection from "../UsersSection/UsersSection";
import PersonalInfo from "../../SellerProfileComponents/PersonalInfo/PersonalInfo";
import ShopInfo from "../../SellerProfileComponents/ShopInfo/ShopInfo";
import BankInfo from "../../SellerProfileComponents/BankInfo/BankInfo";
import ChangePassword from "../../SellerProfileComponents/ChangePassword/ChangePassword";
import ProductsSection from "../ProductsSection/ProductsSection";
import AddProducts1 from "../ProductsSection/ProductSectionComponents/AddProductsSection1/AddProducts1";
import AddProducts2 from "../ProductsSection/ProductSectionComponents/AddProductsSection2/AddProducts2";
import AddProducts3 from "../ProductsSection/ProductSectionComponents/AddProductsSection3/AddProducts3";
import ReviewSection from "../ReviewSection/ReviewSection";
import ComplaintSection from "../ComplaintSection/ComplaintSection";
import FollowUpPage from "../ComplaintSection/FollowUpPage/FollowUpPage ";
import QandaSection from "../QandaSection/QandaSection";
import FeedBackSection from "../FeedBackSection/FeedBackSection";
import OrdersSection from "../OrdersSection/OrdersSection";
import ReturnRefundSection from "../ReturnRefundSection/ReturnRefundSection";
import RevenueSection from "../RevenueSection/RevenueSection";
import NotificationSection from "../NotificationSection/NotificationSection";



const RightSection = ({currentView,setCurrentView,setCountN,countN,searchTerm}) => {
    const [yourcomplaint,setYourComplaint]=useState("");
    return (
      <div className="h-[630px] w-screen bg-white overflow-y-auto p-2">
      {currentView==="mainsection"&&<MainSection setCurrentView={setCurrentView}/>}
      {currentView==="users"&&<UsersSection setCurrentView={setCurrentView} searchTerm={searchTerm}/>}
      {currentView==="ratings" && <ReviewSection setCurrentView={setCurrentView}/> }
      {currentView==="complaints" && <ComplaintSection setCurrentView={setCurrentView} setYourComplaint={setYourComplaint}/> }
      {currentView==="followup" && <FollowUpPage setCurrentView={setCurrentView} yourcomplaint={yourcomplaint}/>}
      {currentView==="qanda" && <QandaSection setCurrentView={setCurrentView}/>}
      {currentView==="feedback" && <FeedBackSection setCurrentView={setCurrentView}/>}
      {currentView==="orders" && <OrdersSection/>}
      {currentView==="returnrefund" && <ReturnRefundSection setCurrentView={setCurrentView}/>}
      {currentView==="revenue" && <RevenueSection setCurrentView={setCurrentView}/>}
    


      {currentView==="products"&& <ProductsSection setCurrentView={setCurrentView} searchTerm={searchTerm} />}
      {currentView==="add1"&& <AddProducts1  setCurrentView={setCurrentView} />}
      {currentView==="add2"&& <AddProducts2  setCurrentView={setCurrentView} />}
      {currentView==="add3"&& <AddProducts3 setCurrentView={setCurrentView} />}
      {currentView==="profile"&&<PersonalInfo setCurrentView={setCurrentView}/>}
      {currentView==="shopinfo"&&<ShopInfo setCurrentView={setCurrentView}/>}
      {currentView==="bankinfo"&&<BankInfo setCurrentView={setCurrentView}/>}
      {currentView==="changepassword"&&<ChangePassword setCurrentView={setCurrentView}/>}
      {currentView==="notification"&& <NotificationSection  setCountN={setCountN} countN={countN} />}
      <Footer/>
        </div>
    );
};

export default RightSection;
