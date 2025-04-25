import React from "react";
import { Routes,Route } from "react-router-dom";
import HomePage from '../pages/User/HomePage/HomePage'
import SignUpPage from '../pages/User/SignUpPage/SignUpPage'
import LoginPage from "../pages/User/LoginPage/LoginPage";
import ProfilePage from "../pages/User/ProfilePage/ProfilePage";
import ViewProfile from "../components/User/ProfileComponents/ViewProfile/ViewProfile";
import ChangePassword from "../components/User/ProfileComponents/ChangePassword/ChangePassword";
import BillingAddress from "../components/User/ProfileComponents/BillingAddress/BillingAddress";
import ProductPage from "../pages/User/ProductPage/ProductPage";
import HandleRedirect from "../pages/User/HandleRedirect/HandleRedirect";

const UserRoutes = () => {
  return (
    <>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/authredirect" element={<HandleRedirect />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/viewprofile" element={<ViewProfile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/billingaddress" element={<BillingAddress />} />
          <Route path="/productview/:id" element={<ProductPage />} />
      </Routes>  
    </>
  )
}

export default UserRoutes
