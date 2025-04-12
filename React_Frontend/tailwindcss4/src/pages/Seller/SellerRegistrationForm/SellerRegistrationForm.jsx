import React, { useState } from "react";
import LandPageFooter from "../../../components/Seller/LandPageFooter/LandPageFooter";
import { Link } from "react-router-dom";

const SellerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    shopAddress: "",
    shopLogo: null,
    shopBanner: null,
    description: "",
    businessRegistrationNumber: "",
    taxId: "",
    bankAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    paymentMethod: "Bank Transfer",
    termsAgreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add form submission logic here
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
            Seller Registration
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
            />
          </div>
          {/* Description Field */}
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



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700">Shop Logo</label>
              <input
                type="file"
                name="shopLogo"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
                accept="image/*"
              />
            </div>
            <div>
              <label className="block text-gray-700">Shop Banner</label>
              <input
                type="file"
                name="shopBanner"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
                accept="image/*"
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
          </div>

          {/* Payout Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Payout Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-gray-700">Bank Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
          </div>

          {/* Agreement */}
          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label className="text-gray-700">
              I agree to the <a href="#" className="text-blue-600 underline">terms and conditions</a>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Register
          </button>
        </form>
      </div>
      <LandPageFooter />
    </>
  );
};

export default SellerRegistrationForm;
