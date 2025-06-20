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
import ErrorBoundary from '../../../components/ErrorBoundary'
const HomePage = ({countsN,setNcounts,setCartCount,cartCount}) => {
   const[topdata,setTopData]=useState([])
  return (
    <div>
      <ErrorBoundary>
      <Header countsN={countsN} setNcounts={setNcounts} setCartCount={setCartCount} cartCount={cartCount}></Header>
      </ErrorBoundary>
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
