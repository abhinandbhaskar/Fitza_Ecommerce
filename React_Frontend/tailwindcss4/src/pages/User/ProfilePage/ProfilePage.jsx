import React,{useState} from 'react'
import "./ProfilePage.css"
import MyProfile from '../../../components/User/MyProfile/MyProfile'
import Header from '../../../components/User/Header/Header'
import Footer from '../../../components/User/Footer/Footer'
import { useLocation } from "react-router-dom";
import { useEffect } from 'react'

const ProfilePage = ({countsN}) => {
  const [currentView, setCurrentView] = useState("profile");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.currentView) {
      setCurrentView(location.state.currentView);
    }
  }, [location.state]);

  return (
    <div>
        <Header countsN={countsN}/>
        <MyProfile currentView={currentView} setCurrentView={setCurrentView}/>
        <Footer/>
    </div>
  )
}

export default ProfilePage
