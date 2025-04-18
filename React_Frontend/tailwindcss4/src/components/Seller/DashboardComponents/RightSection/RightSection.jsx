import React from "react";
import Footer from "../../Footer/Footer";
import MainSection from "../MainSection/MainSection";
import UsersSection from "../UsersSection/UsersSection";
import SellerSection from "../SellerSection/SellerSection";
import PersonalInfo from "../../SellerProfileComponents/PersonalInfo/PersonalInfo";
import ShopInfo from "../../SellerProfileComponents/ShopInfo/ShopInfo";
import BankInfo from "../../SellerProfileComponents/BankInfo/BankInfo";
import ChangePassword from "../../SellerProfileComponents/ChangePassword/ChangePassword";

const RightSection = ({currentView,setCurrentView}) => {
    return (
        <div className="h-screen w-full bg-gray-800 p-4 overflow-y-auto">
      {currentView==="mainsection"&&<MainSection/>}
      {currentView==="users"&&<UsersSection/>}
      {currentView==="profile"&&<PersonalInfo setCurrentView={setCurrentView}/>}
      {currentView==="shopinfo"&&<ShopInfo setCurrentView={setCurrentView}/>}
      {currentView==="bankinfo"&&<BankInfo setCurrentView={setCurrentView}/>}
      {currentView==="changepassword"&&<ChangePassword setCurrentView={setCurrentView}/>}
      <Footer/>
        </div>
    );
};

export default RightSection;
