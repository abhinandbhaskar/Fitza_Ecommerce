import React, { useState } from "react";
import "./MyProfile.css";
import axios from "axios";
import profile from "../../../assets/profile.jpg";
import ViewProfile from "../../../components/User/ProfileComponents/ViewProfile/ViewProfile"
import ChangePassword from "../../../components/User/ProfileComponents/ChangePassword/ChangePassword";
import BillingAddress from "../../../components/User/ProfileComponents/BillingAddress/BillingAddress";
import ShippingAddress from "../ProfileComponents/ShippingAddress/ShippingAddress";
import MyOrders from "../ProfileComponents/MyOrders/MyOrders";
import Wallet from "../ProfileComponents/Wallet/Wallet";
import DeleteAccount from "../ProfileComponents/DeleteAccount/DeleteAccount";
import { useDispatch,useSelector } from "react-redux";
import { logoutUser } from "../../../redux/authActions";
const MyProfile = () => {
    const [currentView,setCurrentView]=useState("profile");
    console.log(currentView);
    const dispatch=useDispatch()
    const{accessToken}=useSelector((state)=>state.auth);

    const handleLogout = async () => {
        console.log("Yes");
        try {
            // Get token from Redux store
    
            await axios.post(
                "http://127.0.0.1:8000/api/logout/",
                {},
                {
                    withCredentials: true, // Ensure cookies are sent
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Include access token
                    },
                }
            );
    
            dispatch(logoutUser()); // Clear Redux state
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    
    

    return (
        <div className="h-auto w-screen flex flex-row border-2 justify-center  border-gray-200">
            <div className="h-screen w-1/2 m-1 flex justify-center  items-center flex-col">
                <div className="h-[60%] w-full  flex items-center pt-14 flex-col justify-center">
                    <img src={profile} className="h-[180px] w-[180px] rounded-full" alt="" />
                    <h1 className="font-bold text-2xl">Kamala Haris</h1>
                </div>
                <div className="h-[100%] w-full flex items-center justify-center flex-col">
                    <button onClick={()=>setCurrentView("profile")} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400 hover:bg-red-400"> <i class="fa-solid fa-user pr-5 "></i> <span className="text-lg hover:text-white">Account details</span></button>
                    <button onClick={()=>setCurrentView("password")} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400  hover:bg-red-400"><i class="fa-solid fa-key  pr-5"></i><span className="text-lg hover:text-white">Change Password</span></button>
                    <button onClick={()=>setCurrentView("billing")} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400  hover:bg-red-400"><i class="fa-solid fa-address-card  pr-5"></i><span className="text-lg hover:text-white">Billing Address</span></button>
                    <button onClick={()=>setCurrentView("shipping")} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400  hover:bg-red-400"><i class="fa-solid fa-truck  pr-5"></i><span className="text-lg hover:text-white">Shipping Address</span></button>
                    <button onClick={()=>setCurrentView("myorders")} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400  hover:bg-red-400"><i class="fa-solid fa-cart-shopping  pr-5"></i><span className="text-lg hover:text-white">My Orders</span></button>
                    <button onClick={()=>setCurrentView("wallet")} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400  hover:bg-red-400"><i class="fa-solid fa-wallet  pr-5"></i><span className="text-lg hover:text-white">Wallet</span></button>
                    <button onClick={()=>setCurrentView("delete")} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400  hover:bg-red-400"><i class="fa-solid fa-trash  pr-5"></i><span className="text-lg hover:text-white">Delete Account</span></button>
                    <button onClick={handleLogout} className="px-6 py-2 w-10/14 bg-gray-200 flex flex-row items-center justify-start border-1 border-gray-400 hover:bg-blue-800 hover:text-xl hover:text-white"><i class="fa-solid fa-right-from-bracket  pr-5"></i><span className="text-lg">SignOut</span></button>
                </div>
            </div>
            <div className="h-auto w-[100%] m-1 shadow-2xl border-1 border-gray-300 my-9 rounded-2xl">
                
                { currentView === "profile" && <ViewProfile/> }
                { currentView === "password" && <ChangePassword/>}
                { currentView === "billing" && <BillingAddress/>}
                { currentView === "shipping" && <ShippingAddress/>}
                { currentView === "myorders" && <MyOrders/>}
                { currentView === "wallet" && <Wallet/>}
                { currentView === "delete" && <DeleteAccount/>}
           
            </div>
        </div>
    );
};

export default MyProfile;
