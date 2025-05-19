import React,{useState} from 'react'
import "./DashboardPage.css"
import Header from '../../../components/Admin/Header/Header'
import Dashboard from '../../../components/Admin/Dashboard/Dashboard'
const DashboardPage = () => {
  const[currentView,setCurrentView]=useState("mainsection");
  const[countN,setCountN]=useState(0);
  return (
    <div>
      <Header countN={countN} setCountN={setCountN} setCurrentView={setCurrentView}/>
      <Dashboard setCountN={setCountN} currentView={currentView} setCurrentView={setCurrentView}/>
    </div>
  )
}

export default DashboardPage
