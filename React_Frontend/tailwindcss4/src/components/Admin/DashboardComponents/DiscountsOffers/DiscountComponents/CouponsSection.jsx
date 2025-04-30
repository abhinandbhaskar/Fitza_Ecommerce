import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const CouponsSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [couponData, setCouponData] = useState({
    id:"",
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
  });
  const {accessToken}=useSelector((state)=>state.auth);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = async(id) => {
    if (editingIndex !== null) {
      setCoupons((prev) =>
        prev.map((coupon, index) =>
          index === editingIndex ? couponData : coupon
        )
      );

      console.log("Edit Coupon Data",couponData);
      console.log("Edit Coupon DataId",id);

      
      try{
        const response=await axios.post(`https://127.0.0.1:8000/api/admin/edit_coupon_data/${id}/`,couponData,{
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${accessToken}`,
            }
        });
        console.log(response);
        console.log(response.data);
        alert(response.data.message);
        fetchCoupon();
      }catch(errors)
      {
        console.log(errors);
        console.log(errors.response);
      }






      setEditingIndex(null);
    } else {
      setCoupons((prev) => [...prev, couponData]);
      console.log("ADDCoupon data",couponData);

      try{
        const response=await axios.post("https://127.0.0.1:8000/api/admin/add_coupon/",couponData,{
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${accessToken}`,
            }
        });
        console.log(response);
        console.log(response.data);
        alert(response.data.message);
        fetchCoupon();
      }catch(errors)
      {
        console.log(errors);
        console.log(errors.response);
      }

    }
    setCouponData({
      id:"",
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumOrderAmount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
    });

   

  };

  const handleEditCoupon = async(index) => {
    try{
      const response=await axios.get(`https://127.0.0.1:8000/api/admin/get_edit_coupon/${index}/`,{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
      });
      console.log(response);
      console.log(response.data);
      // setCoupons(response.data);
      setCouponData({
        id: response.data[0].id,
        code: response.data[0].code,
        discountType: response.data[0].discount_type,
        discountValue: response.data[0].discount_value,
        minimumOrderAmount: response.data[0].minimum_order_amount,
        startDate:  response.data[0].start_date,
        endDate: response.data[0].end_date,
        usageLimit: response.data[0].usage_limit,
        
      });
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response);
    }


    // setCouponData(coupons[index]);
    setEditingIndex(index);
  };

  const handleDeleteCoupon = async(index) => {
    setCoupons((prev) => prev.filter((_, i) => i !== index));

    try{
      const response=await axios.post(`https://127.0.0.1:8000/api/admin/delete_coupon/${index}/`,{},{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      fetchCoupon();
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response);
    }

  };

  const fetchCoupon=async()=>{

    try{
      const response=await axios.get("https://127.0.0.1:8000/api/admin/get_coupons/",{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
      });
      console.log(response);
      console.log(response.data);
      setCoupons(response.data);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response);
    }

  }

  useEffect(()=>{
    fetchCoupon();
  },[])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Coupons</span>
        </h1>
      </div>

      {/* Add Coupon Form */}
      <div className="bg-white shadow-md rounded-lg p-6 m-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingIndex !== null ? "Edit Coupon" : "Add New Coupon"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Fields */}
          {["code", "discountValue", "minimumOrderAmount", "usageLimit"].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 mb-2">
                {field.split(/(?=[A-Z])/).join(" ")}
              </label>
              <input
                type={field === "code" ? "text" : "number"}
                name={field}
                value={couponData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder={`Enter ${field.split(/(?=[A-Z])/).join(" ").toLowerCase()}`}
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-600 mb-2">Discount Type</label>
            <select
              name="discountType"
              value={couponData.discountType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          {["startDate", "endDate"].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 mb-2">
                {field.split(/(?=[A-Z])/).join(" ")}
              </label>
              <input
                type="date"
                name={field}
                value={couponData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
        <button
          onClick={()=>handleAddCoupon(couponData.id)}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {editingIndex !== null ? "Update Coupon" : "Add Coupon"}
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white shadow-md rounded-lg p-6 m-6">
        <h2 className="text-xl font-semibold mb-4">Existing Coupons</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Code</th>
              <th className="border border-gray-300 px-4 py-2">Discount Type</th>
              <th className="border border-gray-300 px-4 py-2">Discount Value</th>
              <th className="border border-gray-300 px-4 py-2">Min Order Amount</th>
              <th className="border border-gray-300 px-4 py-2">Start Date</th>
              <th className="border border-gray-300 px-4 py-2">End Date</th>
              <th className="border border-gray-300 px-4 py-2">Usage Limit</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((coupon, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{coupon.code}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.discount_type}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.discount_value}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.minimum_order_amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.start_date}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.end_date}</td>
                  <td className="border border-gray-300 px-4 py-2">{coupon.usage_limit}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEditCoupon(coupon.id)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border border-gray-300 px-4 py-2 text-center">
                  No coupons added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponsSection;


