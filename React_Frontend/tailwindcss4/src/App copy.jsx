import React,{useEffect} from 'react'
import { useDispatch } from "react-redux";
// import axios from "axios";
// import { loginSuccess } from "./redux/authSlice";
import axiosInstance from "./utils/axiosInstance";
import { setAccessToken } from "./redux/authSlice";

import HomePage from './pages/HomePage/HomePage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import { Route,Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage/LoginPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ViewProfile from './components/ProfileComponents/ViewProfile/ViewProfile'
import ChangePassword from './components/ProfileComponents/ChangePassword/ChangePassword'
import BillingAddress from './components/ProfileComponents/BillingAddress/BillingAddress'
import ProductPage from './pages/ProductPage/ProductPage'
import HandleRedirect from './pages/HandleRedirect/HandleRedirect'

const App = () => {

  const dispatch=useDispatch();


  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const { data } = await axiosInstance.post("/refresh-token");
        dispatch(setAccessToken(data.accessToken)); // Store in Redux
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    };

    refreshAccessToken(); // Call it when App loads
  }, [dispatch]);
  

  return (
    <div>
      <Routes>
        <Route path={"/"} element={<HomePage/>}></Route>
        <Route path={"/signup"} element={<SignUpPage/>}></Route>
        <Route path={"/login"} element={<LoginPage/>}></Route>
        <Route path="/authredirect" element={<HandleRedirect />} />
        <Route path={"/profile"} element={<ProfilePage/>}></Route>
        <Route path={"/viewprofile"} element={<ViewProfile/>}></Route>
        <Route path={"/changepassword"} element={<ChangePassword/>}></Route>
        <Route path={"/billingaddress"} element={<BillingAddress/>}></Route>
        <Route path={"/productview"} element={<ProductPage/>}></Route>
      </Routes>
    </div>
  )
}

export default App
