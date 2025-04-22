import axios from "axios";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux";

const ProductsSection = ({setCurrentView}) => {
  const {accessToken}=useSelector((state)=>state.auth);
  const[products,setProducts]=useState([]);
  const AllProducts=async()=>{
    console.log("Get Start...");
    try{
      const reponse=await axios.get("https://127.0.0.1:8000/api/seller/get_all_product/",{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(reponse);
      console.log(reponse.data);
      setProducts(reponse.data);
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.reponse.data);
    }
  }
  useEffect(()=>{
    AllProducts();
  },[])
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Dashboard &gt; <span className="text-indigo-600">Products</span>
        </h1>
        <button onClick={()=>setCurrentView("add1")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">
          + Add Product
        </button>
      </header>

      {/* Overview Section */}
      <section className="p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Total Uploads</h3>
            <p className="text-xl font-bold text-gray-800">21</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">QC in Progress</h3>
            <p className="text-xl font-bold text-yellow-500">10</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Approved Products</h3>
            <p className="text-xl font-bold text-green-500">7</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Rejected Products</h3>
            <p className="text-xl font-bold text-red-500">4</p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="p-6 bg-white shadow-md rounded-lg mx-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Products</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={()=>AllProducts()} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            All
          </button>
          <button className="px-4 py-2 bg-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-300">
            QC in Progress
          </button>
          <button className="px-4 py-2 bg-red-200 text-red-700 rounded-lg hover:bg-red-300">
            QC Rejected
          </button>
          <button className="px-4 py-2 bg-green-200 text-green-700 rounded-lg hover:bg-green-300">
            QC Approved
          </button>
        </div>
      </section>

      {/* Products Table */}
      <section className="p-6">
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-gray-700 font-medium">Product ID</th>
                <th className="px-4 py-2 text-gray-700 font-medium">Product Name</th>
                <th className="px-4 py-2 text-gray-700 font-medium">Quantity</th>
                <th className="px-4 py-2 text-gray-700 font-medium">Price</th>
                <th className="px-4 py-2 text-gray-700 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
            {
              products.map((value,key)=>(
                <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border-t">1</td>
                <td className="px-4 py-2 border-t">Saree</td>
                <td className="px-4 py-2 border-t">10</td>
                <td className="px-4 py-2 border-t">$200</td>
                <td className="px-4 py-2 border-t">
                  <button className="text-red-500 hover:text-red-600">Delete</button>
                </td>
              </tr>
              ))
            }

           
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductsSection;
