import React from 'react'
import { Routes,Route } from "react-router-dom";
import SellerLandPage from '../pages/Seller/SellerLandPage/SellerLandPage';
import SellerLoginPage from '../pages/Seller/SellerLoginPage/SellerLoginPage';
import ShopDetailsRegistrationForm from '../pages/Seller/ShopDetailsRegistrationForm/ShopDetailsRegistrationForm';
import SellerDashboardPage from '../pages/Seller/SellerDashboardPage/SellerDashboardPage';
import SellerRegister from '../pages/Seller/SellerRegister/SellerRegister';
import OTPVerification from "../pages/Seller/OTPVerification/OTPVerification"
import BankDetailsRegistrationForm from "../pages/Seller/BankDetailsRegistrationForm/BankDetailsRegistrationForm";
const SellerRoutes = () => {
  return (
    <>
      <Routes>
          <Route path="/landpage" element={<SellerLandPage />} />
          <Route path="/loginpage" element={<SellerLoginPage/>} />
          <Route path="/shopdetailsregister" element={<ShopDetailsRegistrationForm/>}/>
          <Route path="/sellerregister" element={<SellerRegister/>}/>
          <Route path="/sellerdashboard" element={<SellerDashboardPage/>}/>
          <Route path="/otpverification" element={<OTPVerification/>} />
          <Route path="/bankdetailsregister" element={<BankDetailsRegistrationForm/>} />
      </Routes>  
    </>
  )
}

export default SellerRoutes
