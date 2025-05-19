import React, { useState } from "react";
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
import WishlistPage from "../pages/User/WishlistPage/WishlistPage";
import CategoryProducts from "../pages/User/CategoryProducts/CategoryProducts";
import CartPage from "../pages/User/CartPage/CartPage";
import OfferSection from "../pages/User/OfferSection/OfferSection";
import NotificationPage from "../pages/User/NotificationPage/NotificationPage";

const UserRoutes = () => {
  const [countsN,setNcounts]=useState(0);
  return (
    <>
      <Routes>
          <Route path="/" element={<HomePage countsN={countsN} setNcounts={setNcounts} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/authredirect" element={<HandleRedirect />} />
          <Route path="/profile" element={<ProfilePage countsN={countsN} />} />
          <Route path="/viewprofile" element={<ViewProfile/>} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/billingaddress" element={<BillingAddress />} />
          <Route path="/productview/:id" element={<ProductPage countsN={countsN} />} />
          <Route path="/wishlistview" element={<WishlistPage countsN={countsN}/>}/>
          <Route path="/categoryproduct/:pro_name" element={<CategoryProducts/>} />
          <Route path="/cartpage" element={<CartPage countsN={countsN}/>} />
          <Route path="/offerproduct" element={<OfferSection countsN={countsN} />} />
          <Route path="/notifications" element={<NotificationPage countsN={countsN} setNcounts={setNcounts}/>} />
      </Routes>  
    </>
  )
}

export default UserRoutes
