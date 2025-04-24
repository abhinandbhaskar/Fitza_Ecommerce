import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import {updateProducts} from "../../../../../../redux/ProductsSlice";
const AddProducts1 = ({setCurrentView}) => {
  const {accessToken} = useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  // get data
  const [catename,setCategoryname]=useState([]);
  const[brandname,setBrandname]=useState([]);
  // post datas

  const[product,setProduct]=useState("");
  const[description,setDescription]=useState("");
  const[category,setCategory]=useState("");
  const[brand,setBrand]=useState("");
  const[modelheight,setModelheight]=useState("");
  const[wearing,setWearing]=useState("");
  const[instruction,setInstruction]=useState("");
  const[about,setAbout]=useState("");



  const fetchCategory=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/seller/get_category/",{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      setCategoryname(response.data);
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  const fetchBrands=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/seller/get_brands/",{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      setBrandname(response.data);
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  useEffect(()=>{
  fetchCategory();
  fetchBrands();
  },[])

  const handleAddproduct1=async()=>{
    setCurrentView("add2");


    try {
      dispatch(updateProducts({
        products: product,
        description: description,
        cateid: category,
        brandid: brand,
        modelheight: modelheight,
        modelwearing: wearing,
        instruction: instruction,
        about: about,
      }));
      console.log("Product data updated successfully");
    } catch (error) {
      console.error("Error updating product data:", error);
    }
    
  
    // console.log("productsData1",productsData1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          <span className="text-indigo-600">Add Product</span>
        </h1>
      </header>

      {/* Add Product Form */}
      <section className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
          Product Details
        </h2>

        <form className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-gray-600 font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product name"
              value={product}
              onChange={(e)=>setProduct(e.target.value)}
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-gray-600 font-medium mb-1">
              Product Description
            </label>
            <textarea
              id="productDescription"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product description"
              rows="4"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-600 font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={category} onChange={(e)=>setCategory(e.target.value)}
           >
              <option>Select a category</option>
              {
                catename.map((cate,key)=>(
                  <option key={cate.id} value={cate.id}>{cate.category_name} <span className="text-red-500 text-sm pl-10"> {cate.category_description}</span></option>
                ))
              }
      
            </select>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-gray-600 font-medium mb-1">
              Brand
            </label>
            <select
              id="brand"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={brand} onChange={(e)=>setBrand(e.target.value)}
            >
              <option>Select a brand</option>
              {
                brandname.map((brand,key)=>(
                  <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                ))
              }
      
            </select>
          </div>

          {/* Model Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modelHeight" className="block text-gray-600 font-medium mb-1">
                Model Height
              </label>
              <input
                type="text"
                id="modelHeight"
                className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter model height"
                value={modelheight}
                onChange={(e)=>setModelheight(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="modelWearing" className="block text-gray-600 font-medium mb-1">
                Model Wearing
              </label>
              <input
                type="text"
                id="modelWearing"
                className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter model wearing"
                value={wearing}
                onChange={(e)=>setWearing(e.target.value)}
              />
            </div>
          </div>

          {/* Care Instructions */}
          <div>
            <label htmlFor="careInstructions" className="block text-gray-600 font-medium mb-1">
              Care Instructions
            </label>
            <textarea
              id="careInstructions"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter care instructions"
              rows="4"
              value={instruction}
              onChange={(e)=>setInstruction(e.target.value)}
            ></textarea>
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block text-gray-600 font-medium mb-1">
              About
            </label>
            <textarea
              id="about"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter additional product information"
              rows="4"
              value={about}
              onChange={(e)=>setAbout(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddproduct1}
              
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
            >
              Continue &gt;
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddProducts1;
