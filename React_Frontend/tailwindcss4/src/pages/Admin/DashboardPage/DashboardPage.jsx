import React,{useState} from 'react'
import "./DashboardPage.css"
import Header from '../../../components/Admin/Header/Header'
import Dashboard from '../../../components/Admin/Dashboard/Dashboard'
const DashboardPage = () => {
  const[currentView,setCurrentView]=useState("mainsection");
  const [searchTerm, setSearchTerm] = useState("");
  const[countN,setCountN]=useState(0);
  return (
    <div>
      <Header countN={countN} setCountN={setCountN} setSearchTerm={setSearchTerm} searchTerm={searchTerm} setCurrentView={setCurrentView}/>
              <Dashboard setCountN={setCountN} currentView={currentView} searchTerm={searchTerm} setCurrentView={setCurrentView}/>
    </div>
  )
}

export default DashboardPage
