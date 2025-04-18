import axios from "axios";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux"
const ShopInfo = ({setCurrentView}) => {
  const{accessToken}=useSelector((state)=>state.auth);
  const[data,setData]=useState([]);
  const fetchShop=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/seller/shop_details/",{
        withCredentials:true,
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      setData(response.data);
      console.log(response.data);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }
  useEffect(()=>{
  fetchShop();
  },[])

  const handleBannerUpload = () => {
    // Logic for handling banner upload
  };

  const handleLogoUpload = () => {
    // Logic for handling logo upload
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Breadcrumb */}
      <div className="w-full bg-white shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-700">
          Dashboard &gt; <span className="text-blue-500">Shop Details</span>
        </h1>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl mt-6 p-6">
        {/* Navigation Tabs */}
        <div className="flex justify-around mb-6">
          <button onClick={()=>setCurrentView('profile')} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Profile
          </button>
          <button onClick={()=>setCurrentView('shopinfo')} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Shop Details
          </button>
          <button onClick={()=>setCurrentView('bankinfo')} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Bank Details
          </button>
        </div>

        {/* Shop Banner */}
        <div className="relative mb-6">
          <div
            className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleBannerUpload}
          >
            <img
              src="/path/to/shopbanner.jpg"
              alt="Shop Banner"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition">
              <span className="text-white font-semibold">Update Banner</span>
            </div>
          </div>
        </div>

        {/* Shop Logo */}
        <div className="relative mb-6 flex justify-center">
          <div
            className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
            onClick={handleLogoUpload}
          >
            <img
              src="/path/to/shoplogo.jpg"
              alt="Shop Logo"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition">
              <span className="text-white font-semibold">Update Logo</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Name
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter shop name"
              value={data.shop_name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Address
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter shop address"
              value={data.shop_address}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter contact number"
              value={data.contact_number}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Email
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter shop email"
              value={data.email}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tax ID"
              value={data.tax_id}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Register Number
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter business register number"
              value={data.business_registration_number}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Enter shop description"
              value={data.description}
            ></textarea>
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

export default ShopInfo;

