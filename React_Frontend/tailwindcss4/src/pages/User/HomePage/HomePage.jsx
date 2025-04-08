import React,{useEffect,useState} from 'react'
import Header from '../../../components/User/Header/Header'
import BannerSection from "../../../components/User/Banner/BannerSection"
import TopCollection from '../../../components/User/TopCollection/TopCollection'
import DealsOftheDay from '../../../components/User/DealsOftheDay/DealsOftheDay'
import OffersSection from '../../../components/User/OffersSection/OffersSection'
import NewArrivals from '../../../components/User/NewArrivals/NewArrivals'
import TopRelease from '../../../components/User/TopRelease/TopRelease'
import Footer from '../../../components/User/Footer/Footer'
import api from '../../../utils/api'
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
