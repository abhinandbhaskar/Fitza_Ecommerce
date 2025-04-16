import React, { useEffect, useState } from 'react';
import profile from "../../../assets/profile.jpg";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
const ViewSellerPage = () => {
  const { id } = useParams();
  const[seller,setSeller]=useState(null);
  const [error,setError]=useState(null);
  const {accessToken}=useSelector((state)=>state.auth);
  const fetchProfile = async()=>{
    try{

      const response=await axios.get(`https://127.0.0.1:8000/api/admin/view_sellers_details/${id}/`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
      },
      });
      setSeller(response.data[0]);
    }
    catch(errors)
    {
      console.log(errors);
      if(errors.response)
      {
        console.log(errors.response?.data|| "Error occurred while fetching seller details.");
      }
      else{
        console.log("Error occured...");
      }
    }
  }
  useEffect(()=>{
    fetchProfile();
  },[])
  if(error){
    return(
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-red-500">
      <h2 className="text-xl font-bold">Error</h2>
      <p>{error}</p>
    </div>
    )
  }

if(!seller){
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold">Loading...</h2>
    </div>
  );
}

return (
  <div className="p-4 md:p-8 max-w-4xl mx-auto">
    {/* Seller Details Section */}
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Seller Details</h2>
      <div className="flex items-center space-x-6">
        <img
          src={profile} // Replace with seller's photo URL
          alt="Seller"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">Full Name: {seller.user?.first_name || "Not available"}</p>
          <p>Email Address: {seller.user?.email||"Not available"}</p>
          <p>Mobile Number: {seller.user?.contact_number || "Not available"}</p>
        </div>
      </div>
    </div>

    {/* Shop Details Section */}
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Shop Details</h2>
      <div className="space-y-2">
        <p><strong>Shop Name:</strong>{seller.shop_name || "Not available"}</p>
        <p><strong>Shop Address:</strong> {seller.shop_address || "Not available"}</p>
        <p><strong>Contact Number:</strong> {seller.contact_number || "Not available"}</p>
        <p><strong>Shop Email:</strong> {seller.email || "Not available"}</p>
        <p><strong>Tax ID:</strong>{seller.tax_id || "Not available"}</p>
        <p><strong>Business Registration Number:</strong>{seller.business_registration_number || "Not available"}</p>
        <p><strong>Description:</strong> {seller.description || "Not available"}</p>
      </div>
    </div>

    {/* Bank Details Section */}
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Bank Details</h2>
{
  seller.bank_details?(
    <div className="space-y-2">
    <p><strong>Account Holder Name:</strong>{seller.bank_details.account_holder_name}</p>
    <p><strong>Bank Name:</strong> {seller.bank_details.bank_name}</p>
    <p><strong>Account Number:</strong> {seller.bank_details.account_number}</p>
    <p><strong>IFSC Code:</strong> {seller.bank_details.ifsc_code}</p>
    <p><strong>Branch Address:</strong> {seller.bank_details.branch_address}</p>
  </div>
  ):
  (
    <p>Bank details are not available.</p>
  )
}
    </div>
  </div>
);

};

export default ViewSellerPage;
