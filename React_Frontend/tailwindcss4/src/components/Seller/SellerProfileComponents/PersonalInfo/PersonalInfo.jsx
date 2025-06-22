import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalInfo = ({ setCurrentView }) => {
  const { accessToken } = useSelector((state) => state.auth);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [photo, setPhoto] = useState("");
  
  // Address fields
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  
  const navigate = useNavigate();

const fetchProfile = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/seller/seller_profile/", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data;
      console.log("OurData", data);
      
      // Set basic user info
      setFullname(data.first_name || "");
      setEmail(data.email || "");
      setMobile(data.phone_number || "");
      
      // Set photo if exists
      if (data.userphoto) {
        const imageLink = "https://127.0.0.1:8000" + data.userphoto;
        setPhoto(imageLink || "");
      }
      
      // Set address fields if they exist in the response
      if (data.address) {
        setAddressLine1(data.address.address_line1 || "");
        setCity(data.address.city || "");
        setState(data.address.state || "");
        setPostalCode(data.address.postal_code || "");
        setCountry(data.address.country || "");
        setAddressPhone(data.address.phone || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateData = async () => {
    const formData = new FormData();
    formData.append("fullname", fullname.trim());
    formData.append("email", email.trim());
    formData.append("mobile", mobile.trim());
    
    // Address fields
    formData.append("address_line1", addressLine1.trim());
    formData.append("city", city.trim());
    formData.append("state", state.trim());
    formData.append("postal_code", postalCode.trim());
    formData.append("country", country.trim());
    formData.append("address_phone", addressPhone.trim());
    formData.append("address_type", "shipping"); // Default to shipping address
    
    if (photo instanceof File) {
      formData.append("photo", photo);
    }

    console.log("FormData Content:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    
    try {
      const response = await axios.post("https://127.0.0.1:8000/api/seller/update_profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      toast.success("Profile updated successfully...");
    } catch (errors) {
      console.log(errors);
      console.log(errors.response.data);
      toast.error("Error while update profile");
      
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
                    ? URL.createObjectURL(photo)
                    : photo
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
                setPhoto(file);
              }
            }}
          />
        </div>

        {/* Personal Info Section */}
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            <button onClick={() => setCurrentView('changepassword')} className="bg-blue-600 px-3 py-2 rounded-md text-white">
              Update Password
            </button>
          </div>
        </div>

        {/* Address Section */}
        <h2 className="text-xl font-semibold mb-4">Address Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your address"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Province
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone (for address)
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number for address"
              value={addressPhone}
              onChange={(e) => setAddressPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button onClick={() => updateData()} className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
       <ToastContainer/>
    </div>
  );
};

export default PersonalInfo;