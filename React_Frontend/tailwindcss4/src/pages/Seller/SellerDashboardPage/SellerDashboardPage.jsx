import React from 'react'
import { useState } from 'react'
import Header from '../../../components/Seller/Header/Header'
import Dashboard from "../../../components/Seller/Dashboard/Dashboard"
const SellerDashboardPage = () => {
    const [currentView, setCurrentView] = useState("mainsection");
    const[countN,setCountN]=useState(0);
  return (
    <>
      <Header setCountN={setCountN} countN={countN} setCurrentView={setCurrentView}/>
      <Dashboard setCountN={setCountN} countN={countN} currentView={currentView} setCurrentView={setCurrentView}/>
    </>
  )
}

export default SellerDashboardPage
