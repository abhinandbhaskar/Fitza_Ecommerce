import React from 'react'
import { Routes,Route } from "react-router-dom";
import SellerLandPage from '../pages/Seller/SellerLandPage/SellerLandPage';
import SellerLoginPage from '../pages/Seller/SellerLoginPage/SellerLoginPage';
import SellerRegistrationForm from '../pages/Seller/SellerRegistrationForm/SellerRegistrationForm';
import SellerDashboardPage from '../pages/Seller/SellerDashboardPage/SellerDashboardPage';
import SellerRegister from '../pages/Seller/SellerRegister/SellerRegister';
import OTPVerification from "../pages/Seller/OTPVerification/OTPVerification"
const SellerRoutes = () => {
  return (
    <>
      <Routes>
          <Route path="/landpage" element={<SellerLandPage />} />
          <Route path="/loginpage" element={<SellerLoginPage/>} />
          <Route path="/mainsellerregister" element={<SellerRegistrationForm/>}/>
          <Route path="/sellerregister" element={<SellerRegister/>}/>
          <Route path="/sellerdashboard" element={<SellerDashboardPage/>}/>
          <Route path="/otpverification" element={<OTPVerification/>} />
      </Routes>  
    </>
  )
}

export default SellerRoutes
