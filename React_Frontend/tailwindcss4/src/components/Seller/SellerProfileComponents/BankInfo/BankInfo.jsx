import axios from "axios";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux"

const BankInfo = ({setCurrentView}) => {
  const {accessToken}=useSelector((state)=>state.auth);
  const[bankdata,setBankData]=useState([]);
  const fetchBankData=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/seller/bank_details/",{
        withCredentials:true,
        headers:{
       Authorization:`Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      setBankData(response.data);
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }
  useEffect(()=>{
    fetchBankData();
  },[])
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Breadcrumb */}
      <div className="w-full bg-white shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-700">
          Dashboard &gt; <span className="text-blue-500">Bank Details</span>
        </h1>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl mt-6 p-6">
        {/* Navigation Tabs */}
        <div className="flex justify-around mb-6">
          <button onClick={()=>setCurrentView('profile')}  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Profile
          </button>
          <button onClick={()=>setCurrentView('shopinfo')} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Shop Details
          </button>
          <button onClick={()=>setCurrentView('bankinfo')} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Bank Details
          </button>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter account holder's name"
              value={bankdata.account_holder_name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter bank name"
              value={bankdata.bank_name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter account number"
              value={bankdata.account_number}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter IFSC code"
              value={bankdata.ifsc_code}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch Address
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter branch address"
              value={bankdata.branch_address}
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

export default BankInfo;

