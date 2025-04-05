import React,{useEffect,useState} from 'react'
import Header from '../../components/Header/Header'
import BannerSection from "../../components/Banner/BannerSection"
import TopCollection from '../../components/TopCollection/TopCollection'
import DealsOftheDay from '../../components/DealsOftheDay/DealsOftheDay'
import OffersSection from '../../components/OffersSection/OffersSection'
import NewArrivals from '../../components/NewArrivals/NewArrivals'
import TopRelease from '../../components/TopRelease/TopRelease'
import Footer from '../../components/Footer/Footer'
import api from '../../utils/api'
const HomePage = () => {
  // const[data,setData]=useState(null);
  // useEffect(()=>{
  //   api.get("/user/")
  //   .then((res)=>setData(res.data))
  //   .catch((err)=>console.error("Error fetching data",err));
  // },[]);
  // console.log(data);
  return (
    <div>
      <Header></Header>
      <BannerSection/>
      <DealsOftheDay/>
      <TopCollection/>
     <OffersSection/>
     <NewArrivals/>
     <TopRelease/>
     <Footer/>
    </div>
  )
}

export default HomePage
