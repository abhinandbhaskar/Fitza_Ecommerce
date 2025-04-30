import React, { useState } from 'react'
import "./Dashboard.css"
import SideBar from '../DashboardComponents/SideBar/SideBar'
import RightSection from '../DashboardComponents/RightSection/RightSection'
const Dashboard = () => {
  const[currentView,setCurrentView]=useState("mainsection");
  return (
    <div className='h-screen w-screen bg-gray-600 flex flex-row'>
      <SideBar setCurrentView={setCurrentView}/>
      <RightSection currentView={currentView} setCurrentView={setCurrentView}/>
    </div>
  )
}

export default Dashboard
