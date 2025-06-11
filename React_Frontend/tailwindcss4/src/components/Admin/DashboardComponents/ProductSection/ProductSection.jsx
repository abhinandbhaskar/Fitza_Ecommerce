import React,{ useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import AllProducts from "./ProductSectionComponents/AllProducts/AllProducts";
import PendingApprovals from "./ProductSectionComponents/PendingApprovals/PendingApprovals";
import Categories from "./ProductSectionComponents/Categories/Categories";
import ProductsInsights from "./ProductSectionComponents/ProductsInsights/ProductsInsights";
import ProductAttributes from "./ProductSectionComponents/ProductAttributes/ProductAttributes";


const ProductSection = ({searchTerm}) => {
    const [newCurrentView,setnewCurrentView]=useState("mainsection");
  // Sample data for the chart
  const data = [
    { name: "Category A", sales: 400 },
    { name: "Category B", sales: 300 },
    { name: "Category C", sales: 200 },
    { name: "Category D", sales: 278 },
    { name: "Category E", sales: 189 },
  ];

  useEffect(()=>{
    if(searchTerm){
   setnewCurrentView("allproducts");
    }
  },[searchTerm])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Products</span>
        </h1>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button onClick={()=>setnewCurrentView('allproducts')} className="flex flex-col items-center justify-center p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700">
            <span className="text-sm font-semibold">View All Products</span>
            <span className="text-xs opacity-80">Manage existing products</span>
          </button>
          <button  onClick={()=>setnewCurrentView('pending')} className="flex flex-col items-center justify-center p-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600">
            <span className="text-sm font-semibold">Pending Approvals</span>
            <span className="text-xs opacity-80">Approve or reject products</span>
          </button>
          <button  onClick={()=>setnewCurrentView('categories')} className="flex flex-col items-center justify-center p-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700">
            <span className="text-sm font-semibold">Manage Categories</span>
            <span className="text-xs opacity-80">Add or edit categories</span>
          </button>
          <button  onClick={()=>setnewCurrentView('insights')} className="flex flex-col items-center justify-center p-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700">
            <span className="text-sm font-semibold">Product Insights</span>
            <span className="text-xs opacity-80">View analytics</span>
          </button>
          <button  onClick={()=>setnewCurrentView('attribute')} className="flex flex-col items-center justify-center p-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700">
            <span className="text-sm font-semibold">Product Attributes</span>
            <span className="text-xs opacity-80">Manage colors, sizes, etc.</span>
          </button>
        </div>
      </div>

{ newCurrentView ==="mainsection" && 
(<div>
      {/* Product Stats */}
      <div className="w-full max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h1 className="text-lg font-semibold text-gray-700">Total Products</h1>
            <p className="text-2xl font-bold text-indigo-600">500</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h1 className="text-lg font-semibold text-gray-700">Pending Approvals</h1>
            <p className="text-2xl font-bold text-indigo-600">10</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h1 className="text-lg font-semibold text-gray-700">Categories</h1>
            <p className="text-2xl font-bold text-indigo-600">6</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h1 className="text-lg font-semibold text-gray-700">Brands</h1>
            <p className="text-2xl font-bold text-indigo-600">8</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full max-w-7xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Sales by Category</h2>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </div>
</div>)
}
{ newCurrentView ==="allproducts" && <AllProducts searchTerm={searchTerm}/> }
{newCurrentView==="pending" && <PendingApprovals/>}
{newCurrentView==="categories" && <Categories/>}
{newCurrentView==="insights" && <ProductsInsights/>}
{newCurrentView==="attribute"&& <ProductAttributes/>}

    </div>
  );
};

export default ProductSection;
