import React from 'react'
import "./Dashboard.css"
import SideBar from '../DashboardComponents/SideBar'
import RightSection from '../DashboardComponents/RightSection'
const Dashboard = () => {
  return (
    <div className='h-screen w-screen bg-gray-600 flex flex-row'>
      <SideBar/>
      <RightSection/>
    </div>
  )
}

export default Dashboard
