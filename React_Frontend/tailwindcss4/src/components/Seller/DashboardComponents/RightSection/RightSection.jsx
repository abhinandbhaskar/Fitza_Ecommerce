import React from "react";
import Footer from "../../Footer/Footer";
import MainSection from "../MainSection/MainSection";
import UsersSection from "../UsersSection/UsersSection";
import SellerSection from "../SellerSection/SellerSection";

const RightSection = ({currentView}) => {
    return (
        <div className="h-screen w-8/10 bg-white p-4 overflow-y-auto relative ml-77 mt-20">
      {currentView==="mainsection"&&<MainSection/>}
      {currentView==="users"&&<UsersSection/>}
      {currentView==="sellers"&&<SellerSection/>}
      <Footer/>
        </div>
    );
};

export default RightSection;
