import React, { useState } from "react";
import LandPageFooter from "../../../components/Seller/LandPageFooter/LandPageFooter";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // For showing error messages
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShopDetailsRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    shopAddress: "",
    contactNumber: "",
    shopEmail: "",
    taxId: "",
    businessRegistrationNumber: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    shopName: "",
    shopAddress: "",
    contactNumber: "",
    shopEmail: "",
    taxId: "",
    businessRegistrationNumber: "",
    description: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      shopName: "",
      shopAddress: "",
      contactNumber: "",
      shopEmail: "",
      taxId: "",
      businessRegistrationNumber: "",
      description: "",
    };

    // Shop Name validation
    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
      valid = false;
    } else if (formData.shopName.length > 100) {
      newErrors.shopName = "Shop name must be less than 100 characters";
      valid = false;
    }

    // Shop Address validation
    if (!formData.shopAddress.trim()) {
      newErrors.shopAddress = "Shop address is required";
      valid = false;
    } else if (formData.shopAddress.length > 255) {
      newErrors.shopAddress = "Address must be less than 255 characters";
      valid = false;
    }

    // Contact Number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
      valid = false;
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid phone number (10-15 digits)";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.shopEmail.trim()) {
      newErrors.shopEmail = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.shopEmail)) {
      newErrors.shopEmail = "Please enter a valid email address";
      valid = false;
    }

    // Business Registration Number validation
    if (!formData.businessRegistrationNumber.trim()) {
      newErrors.businessRegistrationNumber = "Business registration number is required";
      valid = false;
    } else if (formData.businessRegistrationNumber.length > 50) {
      newErrors.businessRegistrationNumber = "Must be less than 50 characters";
      valid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    } else if (formData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters";
      valid = false;
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log("Form data:", formData);
    try {
      const response = await axios.post(
        "https://127.0.0.1:8000/api/seller/shop_register/",
        formData
      );
      console.log(response);
      console.log(response.data);
      toast.success("Successfully Completed Shop Registration...");

      setTimeout(() => {
        navigate("/seller/bankdetailsregister");
      }, 2000);
    } catch (errors) {
      console.log(errors);
      console.log(errors.response?.data);
      
      // Handle server-side validation errors
      if (errors.response?.data) {
        const serverErrors = errors.response.data;
        const newErrors = {};
        toast.error("Error Occured. Check details ");
        
        // Map server errors to our error state
        for (const key in serverErrors) {
          if (serverErrors.hasOwnProperty(key) && errors.hasOwnProperty(key)) {
            newErrors[key] = serverErrors[key].join(" ");
          }
        }
        
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    } finally {
      console.log("Completed..........");
    }
  };

  return (
    <>
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Fitza</h1>
        <Link
          to="/seller/landpage"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>
      </header>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form
          className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Shop Details Registration
          </h2>

          {/* Shop Information */}
          <div className="mt-6">
            <label className="block text-gray-700">Shop Name</label>
            <input
              type="text"
              name="shopName"
              placeholder="Enter the shopname"
              value={formData.shopName}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.shopName ? "border-red-500" : ""
              }`}
              required
            />
            {errors.shopName && (
              <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Shop Address</label>
            <textarea
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleChange}
              placeholder="enter shopaddress"
              className={`w-full mt-1 p-2 border rounded ${
                errors.shopAddress ? "border-red-500" : ""
              }`}
              rows="3"
              required
            />
            {errors.shopAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.shopAddress}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              placeholder="enter the contact number"
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.contactNumber ? "border-red-500" : ""
              }`}
              required
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Shop Email</label>
            <input
              type="email"
              name="shopEmail"
              value={formData.shopEmail}
              placeholder="enter shop email Id"
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.shopEmail ? "border-red-500" : ""
              }`}
              required
            />
            {errors.shopEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.shopEmail}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-gray-700">Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                placeholder="Enter the taxid"
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded ${
                  errors.taxId ? "border-red-500" : ""
                }`}
              />
              {errors.taxId && (
                <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">
                Business Registration Number
              </label>
              <input
                type="text"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                placeholder="enter the business registration number"
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded ${
                  errors.businessRegistrationNumber ? "border-red-500" : ""
                }`}
                required
              />
              {errors.businessRegistrationNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessRegistrationNumber}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Shop Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
             
              className={`w-full mt-1 p-2 border rounded ${
                errors.description ? "border-red-500" : ""
              }`}
              rows="4"
              placeholder="Provide a brief description of your shop (minimum 20 characters)"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Register Shop
          </button>
        </form>
      </div>
      <LandPageFooter />
       <ToastContainer/>
    </>
  );
};

export default ShopDetailsRegistrationForm;