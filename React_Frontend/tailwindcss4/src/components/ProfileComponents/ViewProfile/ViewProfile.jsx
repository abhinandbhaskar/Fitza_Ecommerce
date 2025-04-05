import React, { useEffect, useState } from "react";
import "./ViewProfile.css";
import axios from "axios";
import { useSelector } from "react-redux";
const ViewProfile = () => {
    const[profileData,setProfileData]=useState("");
    const[error,setError]=useState("");
    const {accessToken}=useSelector((state)=>state.auth);  
    useEffect(()=>{
        const fetchProfile= async ()=>{
            

        try{
            const response = await fetch("http://127.0.0.1:8000/api/profile/",{
                method : "GET",
                headers:{
                    Authorization:`Bearer ${accessToken}`
                },
            });
            if(response.ok){
                const data=await response.json();
                console.log("dddddddddddata",data);
                setProfileData(data);
            
            }
            else{
                setError("Failed to fetch profile data.")
            }
        }
        catch(err)
        {
            setError("Something went wrong.");
        }
        }
        fetchProfile();
    },[]);


    return (
        <div className="h-full w-[100%]  p-10 flex flex-col">
            <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
                <div className="j">
                    <i className="fa-solid fa-user text-4xl p-6"></i>
                </div>
                <h1 className="text-4xl font-bold">User Profile</h1>
            </div>
            <div className="h-[100%] w-[100%]  m-2 flex flex-col  items-center">
                <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                    <label className="flex justify-start" htmlFor="">
                        Full Name :
                    </label>
                    <input
                        type="text"
                        className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Your Full Name"
                        value={profileData.first_name}
                    />
                </div>
                <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                    <label className="flex justify-start" htmlFor="">
                        Email Address :
                    </label>
                    <input
                        type="text"
                        className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Email Address"
                        value={profileData.email}
                    />
                </div>
                <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
                    <label className="flex justify-start" htmlFor="">
                        Mobile Number :
                    </label>
                    <input
                        type="text"
                        className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Mobile Number"
                        value={profileData.phone_number}
                    />
                    
                    <img src={profileData.userphoto} className="h-20 w-20" alt="" />
                   
                </div>


                <div className="h-full w-[100%] m-1">
                  <button className="bg-blue-500 px-4 py-2 rounded-lg text-white text-md hover:bg-blue-700 ml-6">Update Profile</button>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
