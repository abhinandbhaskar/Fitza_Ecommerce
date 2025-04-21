import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const AddProducts2 = ({setCurrentView}) => {
  // get 
    const {accessToken} = useSelector((state)=>state.auth);
    const { products,description,cateid,brandid,modelheight,modelwearing,instruction,about} = useSelector((state) => state.product?.product || {});
    const [color,setColor]=useState([]);
    const[size,setSize]=useState([]);
    // post
    const[colorid,setColorid]=useState("");
    const[sizeid,setSizeid]=useState("");
    const[price,setPrice]=useState("");
    const[productcode,setProductcode]=useState("");
    const[stock,setStock]=useState("");
  
    const fetchColor=async()=>{
      try{
        const response=await axios.get("https://127.0.0.1:8000/api/seller/get_color/",{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        });
        console.log(response.data);
        setColor(response.data);
      }
      catch(errors)
      {
        console.log(errors);
        console.log(errors.response.data);
      }
    }
  
    const fetchSize=async()=>{
      try{
        const response=await axios.get("https://127.0.0.1:8000/api/seller/get_size/",{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        });
        console.log(response.data);
        setSize(response.data);
      }
      catch(errors)
      {
        console.log(errors);
        console.log(errors.response.data);
      }
    }
  
    useEffect(()=>{
      fetchColor();
    fetchSize();
    },[])

    const handleAddproduct2=async()=>{
      
      const productsData={
        "product":products,
        "description":description,
        "cateid":cateid,
        "brandid":brandid,
        "modelheight":modelheight,
        "modelwearing":modelwearing,
        "instruction":instruction,
        "about":about,
        "color":colorid,
        "size":sizeid,
        "price":price,
        "productcode":productcode,
        "stock":stock
      }
      console.log(productsData);

      try{
        const response=await axios.post("https://127.0.0.1:8000/api/seller/add_product/",productsData,{
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${accessToken}`,
          }
        });
        console.log(response);
        console.log(response.data);
        alert(response.data.message);

        setTimeout(()=>{
          setCurrentView("add3");
        },3000)
      }
      catch(errors)
      {
        console.log(errors);
        console.log(errors.response.data);
      }


    }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Dashboard &gt; <span className="text-indigo-600">Add Product Details</span>
        </h1>
      </header>

      {/* Form Section */}
      <section className="p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Product Details</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Color</label>
            <select
              id="color"
               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
               value={colorid}
               onChange={(e)=>setColorid(e.target.value)}
            >
              <option>Select a color</option>
              {
                color.map((color,key)=>(
                  <option value={color.id}>{color.color_name}</option>
                ))
              }
      
            </select>

            </div>

            {/* Size */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Size</label>
              <select
              id="color"
               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
               value={sizeid}
               onChange={(e)=>setSizeid(e.target.value)}
            >
              <option value="">Select a size</option>
              {
                size.map((size,key)=>(
                  <option value={size.id}>{size.size_name}</option>
                ))
              }
      
            </select>
            </div>

            {/* Original Price */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Original Price</label>
              <input
                type="number"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter original price"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
              />
            </div>

            {/* Sale Price */}
            {/* <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Sale Price</label>
              <input
                type="number"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter sale price"
              />
            </div> */}

            {/* Product Code */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Product Code</label>
              <input
                type="text"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product code"
                value={productcode}
                onChange={(e)=>setProductcode(e.target.value)}
              />
            </div>

            {/* Quantity in Stock */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Quantity in Stock</label>
              <input
                type="number"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e)=>setStock(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={handleAddproduct2}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Continue &gt;
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddProducts2;
