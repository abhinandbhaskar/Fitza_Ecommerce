import React,{useEffect,useState} from 'react'
import Header from '../../../components/User/Header/Header'
import BannerSection from "../../../components/User/Banner/BannerSection"
import TopCollection from '../../../components/User/TopCollection/TopCollection'
import DealsOftheDay from '../../../components/User/DealsOftheDay/DealsOftheDay'
// import OffersSection from '../../../components/User/OffersSection/OffersSection'
import NewArrivals from '../../../components/User/NewArrivals/NewArrivals'
import TopRelease from '../../../components/User/TopRelease/TopRelease'
import Footer from '../../../components/User/Footer/Footer'
import api from '../../../utils/api'
const HomePage = () => {
   const[topdata,setTopData]=useState([])
  return (
    <div>
      <Header></Header>
      <BannerSection/>
      <DealsOftheDay/>
      <TopCollection/>
     <NewArrivals setTopData={setTopData}/>
     <TopRelease topdata={topdata}/>
     <Footer/>
    </div>
  )
}

export default HomePage
