import React, { useState } from "react";
import LandPageFooter from "../../../components/Seller/LandPageFooter/LandPageFooter";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShopDetailsRegistrationForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    shopAddress: "",
    contactNumber: "",
    shopEmail: "",
    taxId: "",
    businessRegistrationNumber: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("ooo",formData);
    try{
        const response=await axios.post("https://127.0.0.1:8000/api/seller/shop_register/",formData);
        console.log(response);
        console.log(response.data);
        alert("Successfully Completed Shop Registration...");

        setTimeout(()=>{
          navigate("/seller/bankdetailsregister");
         },2000);    
    }
    catch(errors){
        console.log(errors);
        console.log(errors.response.data);
    }
    finally{
        console.log("Completed..........")
    }
  };

  return (
    <>
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Fitza</h1>
        <Link to="/seller/landpage" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
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
              value={formData.shopName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Shop Address</label>
            <textarea
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Shop Email</label>
            <input
              type="email"
              name="shopEmail"
              value={formData.shopEmail}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-gray-700">Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Business Registration Number</label>
              <input
                type="text"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Shop Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              rows="4"
              placeholder="Provide a brief description of your shop"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Register Shop
          </button>
        </form>
      </div>
      <LandPageFooter />
    </>
  );
};

export default ShopDetailsRegistrationForm;
