import React from 'react'
import { useState } from 'react'
import Header from '../../../components/Seller/Header/Header'
import Dashboard from "../../../components/Seller/Dashboard/Dashboard"
const SellerDashboardPage = () => {
    const [currentView, setCurrentView] = useState("mainsection");
  return (
    <>
      <Header setCurrentView={setCurrentView}/>
      <Dashboard currentView={currentView} setCurrentView={setCurrentView}/>
    </>
  )
}

export default SellerDashboardPage
