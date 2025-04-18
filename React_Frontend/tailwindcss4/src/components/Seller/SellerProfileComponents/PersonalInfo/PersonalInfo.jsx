import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PersonalInfo = ({ setCurrentView }) => {
  const { accessToken } = useSelector((state) => state.auth);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate=useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/seller/seller_profile/", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data;
      console.log("OUrData",data);
      setFullname(data.first_name || "No Value");
      setEmail(data.email || "No Value");
      setMobile(data.phone_number || "No Value");
      const imageLink="https://127.0.0.1:8000"+data.userphoto
      setPhoto(imageLink || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateData=async()=>{
      const formData=new FormData();
      formData.append("fullname",fullname.trim());
      formData.append("email",email.trim());
      formData.append("mobile",mobile.trim());
      if (photo instanceof File) {
        formData.append("photo", photo); // Add the photo file
    }
    // const imageLink="https://127.0.0.1:8000"+photo
    // setPhoto(imageLink || "");

    console.log("FormData Content:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    
      try{
        const response=await axios.post("https://127.0.0.1:8000/api/seller/update_profile/",formData,{
          
          headers:{
            "Content-Type": "multipart/form-data",
            "Authorization":`Bearer ${accessToken}`,
          }
        });
        console.log(response);
        console.log(response.data);
        alert(response.data.message);
        // navigate("/seller/landpage");

      }
      catch(errors)
      {
        console.log(errors);
        console.log(errors.response.data);
      }
  }

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
          <button onClick={() => setCurrentView('profile')} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Profile
          </button>
          <button onClick={() => setCurrentView('shopinfo')} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Shop Details
          </button>
          <button onClick={() => setCurrentView('bankinfo')} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Bank Details
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            {photo ? (
              <img
              src={
                photo instanceof File
                    ? URL.createObjectURL(photo) // Preview the selected file temporarily
                    : photo // Show existing profile photo URL
            }
                alt="Profile"
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <span>No Image</span>
            )}
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

              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPhoto(file); // Set the selected file for submission
                }
            }}
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
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <button onClick={()=>setCurrentView('changepassword')} className="bg-blue-600 px-3 py-2 rounded-md text-white">
              Update Password
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button onClick={()=>updateData()}  className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
