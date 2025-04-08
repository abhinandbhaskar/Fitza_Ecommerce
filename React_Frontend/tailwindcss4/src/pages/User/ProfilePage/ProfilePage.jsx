import React from 'react'
import "./ProfilePage.css"
import MyProfile from '../../../components/User/MyProfile/MyProfile'
import Header from '../../../components/User/Header/Header'
import Footer from '../../../components/User/Footer/Footer'
const ProfilePage = () => {
  return (
    <div>
        <Header/>
        <MyProfile/>
        <Footer/>
    </div>
  )
}

export default ProfilePage
