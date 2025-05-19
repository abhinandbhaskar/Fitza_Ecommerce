import React, { useState } from "react";
import SideBar from "../DashboardComponents/SideBar/SideBar";
import RightSection from "../DashboardComponents/RightSection/RightSection";
import Header from "../Header/Header";

const Dashboard = ({currentView, setCurrentView,setCountN,countN}) => {

  return (
<div className="h-auto w-full absolute top-[100px] flex flex-row ">
      <SideBar setCurrentView={setCurrentView} />
      <div className="h-auto w-8/10 m-1">
      <RightSection  setCountN={setCountN} countN={countN} setCurrentView={setCurrentView} currentView={currentView} />
     
      </div>
    
</div>
  );
};

export default Dashboard;
