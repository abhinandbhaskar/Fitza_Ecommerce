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


const RightSection = ({currentView,setCurrentView}) => {
    const [yourcomplaint,setYourComplaint]=useState("");
    return (
        <div className="h-screen w-full bg-gray-800 p-4 overflow-y-auto">
      {currentView==="mainsection"&&<MainSection/>}
      {currentView==="users"&&<UsersSection/>}
      {currentView==="ratings" && <ReviewSection/> }
      {currentView==="complaints" && <ComplaintSection setCurrentView={setCurrentView} setYourComplaint={setYourComplaint}/> }
      {currentView==="followup" && <FollowUpPage yourcomplaint={yourcomplaint}/>}
      {currentView==="qanda" && <QandaSection/>}
      {currentView==="feedback" && <FeedBackSection/>}
    


      {currentView==="products"&& <ProductsSection setCurrentView={setCurrentView} />}
      {currentView==="add1"&& <AddProducts1  setCurrentView={setCurrentView} />}
      {currentView==="add2"&& <AddProducts2  setCurrentView={setCurrentView} />}
      {currentView==="add3"&& <AddProducts3 setCurrentView={setCurrentView} />}
      {currentView==="profile"&&<PersonalInfo setCurrentView={setCurrentView}/>}
      {currentView==="shopinfo"&&<ShopInfo setCurrentView={setCurrentView}/>}
      {currentView==="bankinfo"&&<BankInfo setCurrentView={setCurrentView}/>}
      {currentView==="changepassword"&&<ChangePassword setCurrentView={setCurrentView}/>}
      <Footer/>
        </div>
    );
};

export default RightSection;
