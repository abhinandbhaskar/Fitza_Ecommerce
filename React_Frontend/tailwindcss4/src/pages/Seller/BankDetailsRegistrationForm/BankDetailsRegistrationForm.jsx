import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BankDetailsRegistrationForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    try{
        const response=await axios.post("https://127.0.0.1:8000/api/seller/bank_seller_register/",formData);
        console.log(response);
        console.log(response.data);
        alert("Successfully Completed Bank Details Registration...");
        setTimeout(()=>{
            navigate("/seller/loginpage");
        },2000)
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
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Branch Address</label>
            <textarea
              name="branchAddress"
              value={formData.branchAddress}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default BankDetailsRegistrationForm;
