import React from 'react'
import "./ProfilePage.css"
import MyProfile from '../../components/MyProfile/MyProfile'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
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
