import React,{useState} from 'react'
import "./DashboardPage.css"
import Header from '../../../components/Admin/Header/Header'
import Dashboard from '../../../components/Admin/Dashboard/Dashboard'
const DashboardPage = () => {
  const[currentView,setCurrentView]=useState("mainsection");
  return (
    <div>
      <Header setCurrentView={setCurrentView}/>
      <Dashboard currentView={currentView} setCurrentView={setCurrentView}/>
    </div>
  )
}

export default DashboardPage
