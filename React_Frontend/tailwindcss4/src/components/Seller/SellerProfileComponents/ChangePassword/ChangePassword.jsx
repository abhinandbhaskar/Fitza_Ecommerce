import React, { useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = ({ setCurrentView }) => {
    const[currentPassword,setCurrentPassword]=useState("");
    const[newPassword,setNewPassword]=useState("");
    const[confirmpassword,setConfirmPassword]=useState("");
    const[error,setError]=useState("");
    const[loading,setLoading]=useState(false);
    const {userId,accessToken,isAuthenticated} = useSelector((state) => state.auth);

    const handleSubmit=async(e)=>{
      e.preventDefault();
      setError("");
      setLoading(true);
      const passwordData={
          currentPassword:currentPassword.trim(),
          newPassword:newPassword.trim(),
          confirmpassword:confirmpassword.trim()
      }
      console.log("XEE",passwordData);
      try{
          const response=await axios.post("https://127.0.0.1:8000/api/passwordchange/",passwordData,{
              headers:{
                  "Content-Type":"application/json",
                  "Authorization": `Bearer ${accessToken}`
              }
          });
          if(response)
          {
            toast.success("Password updated successfully..");  
          }
      }
      catch (err) {
          console.log(err);
          if (err.response) {
              const backendMessage = err.response.data.message;
               toast.error("Error occured while update password...");
              if (backendMessage.non_field_errors) {
                  setError(backendMessage.non_field_errors[0]); 
              } else {
                  setError("Something went wrong.");
              }
      
              console.log(backendMessage.non_field_errors[0]);
          }
      }
      finally{
          setLoading(false);
      }
      

  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      {/* Breadcrumb */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Dashboard &gt;{" "}
          <span className="text-blue-500">Change Password</span>
        </h1>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl mt-6 p-8">
        {/* Navigation Tabs */}

        <div className="flex justify-between mb-8">
          <button
            onClick={() => setCurrentView("profile")}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          >
            Profile
          </button>
          <button
            onClick={() => setCurrentView("shopinfo")}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
          >
            Shop Details
          </button>
          <button
            onClick={() => setCurrentView("bankinfo")}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
          >
            Bank Details
          </button>
        </div>

        {/* Form Section */}

        {error&&(<p className='text-sm text-red-600'>{error}</p>)}
        <form onSubmit={handleSubmit} >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Re-enter new password"
            />
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button type="submit"
            className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all shadow-md"
          >
            Save Changes
          </button>
        </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ChangePassword;
