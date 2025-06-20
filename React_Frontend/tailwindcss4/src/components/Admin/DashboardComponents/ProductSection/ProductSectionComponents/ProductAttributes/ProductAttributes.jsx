import React, { useState } from "react";
import SizeOptions from "./ProductAttributeComponents/SizeOptions";
import ColorOptions from "./ProductAttributeComponents/ColorOptions";
import BrandOptions from "./ProductAttributeComponents/BrandOptions";

const ProductAttributes = () => {
  const[currentView,setCurrentView]=useState("size");
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-indigo-600">Product Attributes</span>
        </h1>
        {/* <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">
          Add Attribute
        </button> */}
      </header>

      {/* Buttons Section */}
      <section className="py-8 px-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Manage Attributes</h2>
        <div className="flex gap-4 flex-wrap">
          <button onClick={()=>setCurrentView("size")} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm shadow hover:bg-blue-700">
            Size
          </button>
          <button onClick={()=>setCurrentView("color")} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm shadow hover:bg-green-700">
            Color
          </button>
          <button onClick={()=>setCurrentView("brand")} className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm shadow hover:bg-purple-700">
            Brand
          </button>
        </div>
      </section>
      {currentView==="size"&& <SizeOptions/>}
      {currentView==="color"&& <ColorOptions/>}
      {currentView==="brand"&& <BrandOptions/>}

    </div>
  );
};

export default ProductAttributes;
