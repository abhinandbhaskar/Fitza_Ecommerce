import React from 'react'
import "./ProfilePage.css"
import MyProfile from '../../../components/User/MyProfile/MyProfile'
import Header from '../../../components/User/Header/Header'
import Footer from '../../../components/User/Footer/Footer'
const ProfilePage = ({countsN}) => {
  return (
    <div>
        <Header countsN={countsN}/>
        <MyProfile/>
        <Footer/>
    </div>
  )
}

export default ProfilePage
