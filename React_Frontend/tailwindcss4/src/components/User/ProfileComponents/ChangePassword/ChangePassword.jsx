import React, { useState } from 'react'
import "./ChangePassword";
import axios from 'axios';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
    const[currentPassword,setCurrentPassword]=useState("");
    const[newPassword,setNewPassword]=useState("");
    const[confirmpassword,setConfirmPassword]=useState("");
    const[error,setError]=useState("");
    const[loading,setLoading]=useState(false);
    const {userId,accessToken,isAuthenticated} = useSelector((state) => state.auth);
    console.log("Auth State:", userId);
    console.log("Auth accessToken:", accessToken);
    console.log("Auth isAuthenticated:", isAuthenticated);

    ;;;
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        const passwordData={
            currentPassword:currentPassword.trim(),
            newPassword:newPassword.trim(),
            confirmpassword:confirmpassword.trim()
        }
        try{
            const response=await axios.post("https://127.0.0.1:8000/api/passwordchange/",passwordData,{
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            if(response)
            {
             alert(response.data.message);   
            }
        }
        catch (err) {
            console.log("XXX", err);
            if (err.response) {
                const backendMessage = err.response.data.message;
        
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
    <div className="h-full w-[100%]  p-10 flex flex-col">
    <div className="h-[100px] w-[100%] m-2 flex flex-row justify-start items-center">
        <div className="j">
            <i class="fa-solid fa-key  text-4xl p-6"></i>
        </div>
        <h1 className="text-4xl font-bold">Change Password</h1>
    </div>
    {error&&(<p className='text-sm text-red-600'>{error}</p>)}
<form onSubmit={handleSubmit} >
<div className="h-[100%] w-[100%]  m-2 flex flex-col  items-center">
        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
            <label className="flex justify-start" htmlFor="">
                Current Password :
            </label>
            <input
                type="text"
                className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e)=>setCurrentPassword(e.target.value)}

            />
        </div>
        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
            <label className="flex justify-start" htmlFor="">
                New Password :
            </label>
            <input
                type="text"
                className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
            />
        </div>

        <div className="h-full w-[100%] font-bold text-md  m-1 flex flex-col ">
            <label className="flex justify-start" htmlFor="">
                Confirm Password :
            </label>
            <input
                type="text"
                className="block w-10/12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter confirm password"
                value={confirmpassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
            />
        </div>
        <div className="h-full w-[100%] m-1">
          <button type='submit' className="bg-blue-500 px-4 py-2 rounded-lg text-white text-md hover:bg-blue-700 ml-6">Change Account Password</button>
        </div>
    </div>
</form>
</div>
  )
}

export default ChangePassword
