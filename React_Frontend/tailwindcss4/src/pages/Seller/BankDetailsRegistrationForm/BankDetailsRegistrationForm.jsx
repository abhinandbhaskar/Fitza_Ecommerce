import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BankDetailsRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchAddress: "",
  });

  const [errors, setErrors] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchAddress: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchAddress: "",
    };

    // Account Holder Name validation
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = "Account holder name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.accountHolderName)) {
      newErrors.accountHolderName = "Name should contain only letters";
      isValid = false;
    }

    // Bank Name validation
    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
      isValid = false;
    }

    // Account Number validation
    if (!formData.accountNumber) {
      newErrors.accountNumber = "Account number is required";
      isValid = false;
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number should be 9-18 digits";
      isValid = false;
    }

    // IFSC Code validation
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
      isValid = false;
    } else if (!/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC code format";
      isValid = false;
    }

    // Branch Address validation
    if (!formData.branchAddress.trim()) {
      newErrors.branchAddress = "Branch address is required";
      isValid = false;
    } else if (formData.branchAddress.length < 10) {
      newErrors.branchAddress = "Address is too short";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    console.log(formData);
    try {
      const response = await axios.post(
        "https://127.0.0.1:8000/api/seller/bank_seller_register/",
        formData
      );
      console.log(response);
      console.log(response.data);
      toast.success("Successfully Completed Bank Details Registration...");
      setTimeout(() => {
        navigate("/seller/loginpage");
      }, 2000);
    } catch (errors) {
      console.log(errors);
      console.log(errors.response.data);
      toast.error("Error Occurred. Check details ");
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
          className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Bank Details Registration
          </h2>

          <div className="mt-4">
            <label className="block text-gray-700">Account Holder Name</label>
            <input
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.accountHolderName ? "border-red-500" : ""
              }`}
              required
            />
            {errors.accountHolderName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountHolderName}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.bankName ? "border-red-500" : ""
              }`}
              required
            />
            {errors.bankName && (
              <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.accountNumber ? "border-red-500" : ""
              }`}
              required
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountNumber}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.ifscCode ? "border-red-500" : ""
              }`}
              required
            />
            {errors.ifscCode && (
              <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Branch Address</label>
            <textarea
              name="branchAddress"
              value={formData.branchAddress}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded ${
                errors.branchAddress ? "border-red-500" : ""
              }`}
              rows="3"
              required
            />
            {errors.branchAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.branchAddress}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default BankDetailsRegistrationForm;