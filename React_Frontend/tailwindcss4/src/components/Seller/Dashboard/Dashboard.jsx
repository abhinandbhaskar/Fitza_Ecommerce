import React, { useState } from "react";
import SideBar from "../DashboardComponents/SideBar/SideBar";
import RightSection from "../DashboardComponents/RightSection/RightSection";

const Dashboard = ({currentView, setCurrentView,setCountN,countN,searchTerm}) => {
  return (
<div className="h-auto w-full absolute top-[100px] flex flex-row ">
      <SideBar setCurrentView={setCurrentView} />
      <RightSection  setCountN={setCountN} countN={countN} setCurrentView={setCurrentView} currentView={currentView} searchTerm={searchTerm} />
</div>
  );
};

export default Dashboard;
