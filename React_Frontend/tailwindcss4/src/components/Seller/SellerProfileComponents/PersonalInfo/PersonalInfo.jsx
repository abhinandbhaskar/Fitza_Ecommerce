import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const PersonalInfo = ({setCurrentView}) => {
  const {accessToken}=useSelector((state)=>state.auth);
  const[user,setUser]=useState([]);
  console.log(accessToken);
  const fetchProfile=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/seller/seller_profile/",{
        withCredentials: true,
        headers:{
          Authorization: `Bearer ${accessToken}`,
        }
      });
      console.log("REs",response);
      console.log("REs",response.data);
      setUser(response.data);

    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }
  useEffect(()=>{
    fetchProfile();
  },[])
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Breadcrumb */}
      <div className="w-full bg-white shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-700">
          Dashboard &gt; <span className="text-blue-500">Personal Info</span>
        </h1>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl mt-6 p-6">
        {/* Navigation Tabs */}
        <div className="flex justify-around mb-6">
          <button onClick={()=>setCurrentView('profile')} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Profile
          </button>
          <button onClick={()=>setCurrentView('shopinfo')}  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Shop Details
          </button>
          <button onClick={()=>setCurrentView('bankinfo')}  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Bank Details
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <img
              src=""
              alt="Profile"
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Profile Picture
          </label>
          <input
            type="file"
            className="text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              value={user.first_name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={user.email}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your mobile number"
              value={user.phone_number}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={user.password}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

