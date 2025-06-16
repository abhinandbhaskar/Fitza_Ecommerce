import axios from "axios";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import { toast } from "react-toastify"; // For showing error messages
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BankInfo = ({setCurrentView}) => {
  const {accessToken}=useSelector((state)=>state.auth);
  const [accholder,setAccholder]=useState("");
  const [bank,setBank]=useState("");
  const [accno,setAccno]=useState("");
  const [ifsc,setIfsc]=useState("");
  const [branch,setBranch]=useState("");
  const fetchBankData=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/seller/bank_details/",{
        withCredentials:true,
        headers:{
       Authorization:`Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      setAccholder(response.data.account_holder_name);
      setBank(response.data.bank_name);
      setAccno(response.data.account_number);
      setIfsc(response.data.ifsc_code);
      setBranch(response.data.branch_address);
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

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("accholder",accholder);
    formData.append("bank",bank);
    formData.append("accno",accno);
    formData.append("ifsc",ifsc);
    formData.append("branch",branch);

    formData.forEach((value,key)=>{
      console.log(key,value);
    })

    try{
      const response=await axios.post("https://127.0.0.1:8000/api/seller/bank_update/",formData,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${accessToken}`
        }
      });
      console.log(response);
      console.log(response.data);
     toast.success("Bank details updated successfully..");
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
      toast.error("Failed to update Bank details..");
    }

  }


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
              value={accholder}
              onChange={(e)=>setAccholder(e.target.value)}
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
              value={bank}
              onChange={(e)=>setBank(e.target.value)}
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
              value={accno}
              onChange={(e)=>setAccno(e.target.value)}
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
              value={ifsc}
              onChange={(e)=>setIfsc(e.target.value)}
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
              value={branch}
              onChange={(e)=>setBranch(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button onClick={handleSubmit} className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default BankInfo;


