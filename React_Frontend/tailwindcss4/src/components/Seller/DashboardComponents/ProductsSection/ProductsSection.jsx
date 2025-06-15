import axios from "axios";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import { safe } from "../../../../utils/safeAccess";

const ProductsSection = ({setCurrentView,searchTerm}) => {
  const {accessToken}=useSelector((state)=>state.auth);
  const[products,setProducts]=useState([]);
  const[productDetails,setProductDetails]=useState([]);
  const[inputView,setInputView]=useState(1);
  const[pageView,setPageView]=useState(false);
  const[stock,setStock]=useState("");
  const [filteredProducts,setFilteredProducts]=useState([]);
  const AllProducts=async(id)=>{
    console.log("Get Start...");
    try{
      const reponse=await axios.get(`https://127.0.0.1:8000/api/seller/get_all_product/${id}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(reponse);
      console.log("GetSet",reponse.data);
      setProducts(reponse.data);
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.reponse.data);
    }
  }

  const OurAllProducts=()=>{
    const id=1;
    AllProducts(id);
    setPageView(false);
    setInputView(id);
  }
  const ProgressProducts=()=>{
    const id=2;
    AllProducts(id);
    setPageView(false);
    setInputView(id);
  }
  const RejectedProducts=()=>{
    const id=3;
    AllProducts(id);
    setPageView(false);
    setInputView(id);
  }
  const ApproveProducts=()=>{
    const id=4;
    AllProducts(id); 
    setPageView(false);
    setInputView(id);
  }


    const ViewProduct=async(id)=>{
      setPageView(true)
      console.log("R",id);
  
      try{
        const response=await axios.get(`https://127.0.0.1:8000/api/admin/view_product/${id}/`,{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
        });
        console.log("ii",response.data[0])
        setProductDetails(response.data[0])
      }catch(errors)
      {
        console.log(errors);
        console.log(errors.response.data);
      }
  
    }

    const fetchStocks=async()=>{

      try{
        const response=await axios.get(`https://127.0.0.1:8000/api/seller/view_stocks/`,{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
        });
        console.log("iii",response.data)
        setStock(response.data);

       
      }catch(errors)
      {
        console.log(errors);
        console.log(errors.response.data);
      }

    }

    useEffect(()=>{
      const id=1;
      AllProducts(id);
      fetchStocks();
    },[])

    useEffect(()=>{
        console.log("Use",searchTerm)
        if(searchTerm.trim()==="")
        {
            setFilteredProducts(products);
        }else{
            const filtered=products.filter(product=>{
                const ProductName =`${product.product.product_name}`.toLowerCase();
                const search = searchTerm.toLowerCase();
                return ProductName.includes(search);
            });
            setFilteredProducts(filtered);
        }

    },[searchTerm,products]);
    

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Dashboard &gt; <span className="text-indigo-600">Products</span>
        </h1>
        <button onClick={()=>setCurrentView("add1")}  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          + Add Product
        </button>
      </header>

      {/* Overview Section */}
      <section className="p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Total Uploads</h3>
            <p className="text-xl font-bold text-gray-800">{safe(stock,'total_products')}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">QC in Progress</h3>
            <p className="text-xl font-bold text-yellow-500">{safe(stock,'pending')}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Approved Products</h3>
            <p className="text-xl font-bold text-green-500">{safe(stock,'approve')}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Rejected Products</h3>
            <p className="text-xl font-bold text-red-500">{safe(stock,'reject')}</p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="p-6 bg-white shadow-md rounded-lg mx-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Products</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={()=>OurAllProducts()}  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            All
          </button>
          <button onClick={()=>ProgressProducts()}  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            QC in Progress
          </button>
          <button onClick={()=>RejectedProducts()}  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            QC Rejected
          </button>
          <button onClick={()=>ApproveProducts()}  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            QC Approved
          </button>
        </div>
      </section>



      {/* Products Table */}

      {pageView===false && (
      <section className="p-6">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th>No.</th>
              <th>Product ID</th>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {
            filteredProducts.map((value,key)=>(
              <tr className="hover:bg-gray-100 transition duration-200">
              <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{key+1}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">#ORD-{safe(value,'id')}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                <img src={ safe(value,'images') && value.images.length > 0 && `https://127.0.0.1:8000${value.images[0].main_image}`}
                    alt="category"
                    className="h-16 w-16 object-cover rounded-full"
                  /></td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(value,'product.product_name')}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(value,'product.product_description')}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">Rs.{safe(value,'original_price')}</td>
              <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                <button onClick={()=>ViewProduct(value.id)} className="text-white bg-blue-600 rounded-md px-2 py-1">View</button>
              </td>
            </tr>
            ))
          }

         
          </tbody>
        </table>
      </div>
    </section>
      )}


      {/* View Product Details */}

{pageView===true  && (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      {/* Header */}
      <div className="w-full max-w-4xl bg-white shadow-md py-6 px-8 rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800">
          <span className="text-indigo-600">Product Details</span>
        </h1>
      </div>
  
      {/* Product Details */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-6 p-6 space-y-6">
        {/* Main Image */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700">Main Image</h2>
          {/* <p>{products.images?.main_image||""}</p> */}
          <img
            src={
              safe(productDetails,'images') &&
              productDetails.images.length > 0 &&
              `https://127.0.0.1:8000${productDetails.images[0].main_image}`
            }
            alt="Main Product"
            className="w-48 h-48 object-cover border border-gray-200 rounded-lg mt-4"
          />
        </div>
  
        {/* Sub Images */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Sub Images</h3>
          <div className="flex space-x-4 mt-4">
            <img
            src={
              safe(productDetails,'images') &&
              productDetails.images.length > 0 &&
              `https://127.0.0.1:8000${productDetails.images[0].sub_image_1}`
            }
              alt="Sub Image 1"
              className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
            />
            <img
            src={
              safe(productDetails,'images') &&
              productDetails.images.length > 0 &&
              `https://127.0.0.1:8000${productDetails.images[0].sub_image_2}`
            }
              alt="Sub Image 2"
              className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
            />
            <img
            src={
              safe(productDetails,'images') &&
              productDetails.images.length > 0 &&
              `https://127.0.0.1:8000${productDetails.images[0].sub_image_3}`
            }
              alt="Sub Image 3"
              className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
            />
          </div>
        </div>
  
        {/* Product Information */}
  {/* Product Information */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      { label: "Product Name", placeholder: "Pant", value: safe(productDetails,'product.product_name') || "" },
      { label: "Product Description", placeholder: "", value: safe(productDetails,'product.product_description') || "" },
      { label: "Category", placeholder: "", value: safe(productDetails,'category.category_name') || "" },
      { label: "Brand", placeholder: "", value: safe(productDetails,'brand.brand_name') || "" },
      { label: "Shop", placeholder: "", value: safe(productDetails,'shop.shop_name') || "" },
      { label: "Model Height", placeholder: "", value: safe(productDetails,'product.model_height') || "" },
      { label: "Model Wearing", placeholder: "", value: safe(productDetails,'product.model_wearing') || "" },
      { label: "Care Instruction", placeholder: "", value: safe(productDetails,'product.care_instructions') || "" },
      { label: "About", placeholder: "", value: safe(productDetails,'product.about') || "" },
      { label: "Color", placeholder: "", value: safe(productDetails,'color.color_name') || "" },
      { label: "Size", placeholder: "", value: safe(productDetails,'size.size_name') || "" },
      { label: "Quantity in Stock", placeholder: "", value: safe(productDetails,'quantity_in_stock') || "" },
      { label: "Original Price", placeholder: "", value: safe(productDetails,'original_price') || "" },

    ].map((field, index) => (
      <div key={index} className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          {field.label}
        </label>
        <input
          type="text"
          placeholder={field.placeholder}
          value={field.value}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          readOnly
        />
      </div>
    ))}

    {inputView===3 && (
      <>
        <div key="" className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
        Reject Reason
        </label>
        <input
          type="text"
          value={safe(productDetails,'rejection_reason')}
          // onChange={(e)=>setSalesprice(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          readOnly         
        />
      </div>
      </>
    )
    }  
        {inputView===4 && (
      <>
              <div key="" className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
        Sales Price
        </label>
        <input
          type="text"
          placeholder="Enter the Sales Price"
          value={safe(productDetails,'sale_price')}
          // onChange={(e)=>setSalesprice(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          readOnly         
        />
      </div>
        <div key="" className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
        Product Code
        </label>
        <input
          type="text"
          value={safe(productDetails,'product_code') }
          // onChange={(e)=>setSalesprice(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          readOnly         
        />
      </div>
      </>
    )
    }  
  </div>
  
  
        {/* Buttons */}
      </div>
    </div>
)}



      
    </div>
  );
};

export default ProductsSection;
