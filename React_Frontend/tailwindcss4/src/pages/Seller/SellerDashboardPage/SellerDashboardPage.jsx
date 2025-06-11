import React from 'react'
import { useState } from 'react'
import Header from '../../../components/Seller/Header/Header'
import Dashboard from "../../../components/Seller/Dashboard/Dashboard"
const SellerDashboardPage = () => {
    const [currentView, setCurrentView] = useState("mainsection");
    const [searchTerm,setSearchTerm]=useState("");
    const[countN,setCountN]=useState(0);
  return (
    <>
      <Header setCountN={setCountN} countN={countN} setCurrentView={setCurrentView} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      <Dashboard setCountN={setCountN} countN={countN} currentView={currentView} setCurrentView={setCurrentView} searchTerm={searchTerm} />
    </>
  )
}

export default SellerDashboardPage
