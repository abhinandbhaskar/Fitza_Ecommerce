import axios from "axios";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux";

const ProductsSection = ({setCurrentView}) => {
  const {accessToken}=useSelector((state)=>state.auth);
  const[products,setProducts]=useState([]);
  const[productDetails,setProductDetails]=useState([]);
  const[pageView,setPageView]=useState(false);
  const[stock,setStock]=useState("");
  const AllProducts=async(id)=>{
    console.log("Get Start...");
    try{
      const reponse=await axios.get(`https://127.0.0.1:8000/api/seller/get_all_product/${id}/`,{
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

  const OurAllProducts=()=>{
    const id=1;
    AllProducts(id);
    setPageView(false);
  }
  const ProgressProducts=()=>{
    const id=2;
    AllProducts(id);
    setPageView(false);
  }
  const RejectedProducts=()=>{
    const id=3;
    AllProducts(id);
    setPageView(false);
  }
  const ApproveProducts=()=>{
    const id=4;
    AllProducts(id); 
    setPageView(false);
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
            <p className="text-xl font-bold text-gray-800">{stock.total_products}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">QC in Progress</h3>
            <p className="text-xl font-bold text-yellow-500">{stock.pending}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Approved Products</h3>
            <p className="text-xl font-bold text-green-500">{stock.approve}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-600 font-medium">Rejected Products</h3>
            <p className="text-xl font-bold text-red-500">{stock.reject}</p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="p-6 bg-white shadow-md rounded-lg mx-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Products</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={()=>OurAllProducts()} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            All
          </button>
          <button onClick={()=>ProgressProducts()} className="px-4 py-2 bg-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-300">
            QC in Progress
          </button>
          <button onClick={()=>RejectedProducts()} className="px-4 py-2 bg-red-200 text-red-700 rounded-lg hover:bg-red-300">
            QC Rejected
          </button>
          <button onClick={()=>ApproveProducts()} className="px-4 py-2 bg-green-200 text-green-700 rounded-lg hover:bg-green-300">
            QC Approved
          </button>
        </div>
      </section>



      {/* Products Table */}

      {pageView===false && (
      <section className="p-6">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-gray-700 font-medium">Product ID</th>
              <th className="px-4 py-2 text-gray-700 font-medium">Product Image</th>
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
              <td className="px-4 py-2 border-t">{value.id}</td>
              <td className="px-4 py-2 border-t">
                <img src={ value.images && value.images.length > 0 && `https://127.0.0.1:8000${value.images[0].main_image}`}
                    alt="category"
                    className="h-16 w-16 object-cover rounded-full"
                  /></td>
              <td className="px-4 py-2 border-t">{value.product.product_name}</td>
              <td className="px-4 py-2 border-t">10</td>
              <td className="px-4 py-2 border-t">$200</td>
              <td className="px-4 py-2 border-t">
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
              productDetails.images &&
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
              productDetails.images &&
              productDetails.images.length > 0 &&
              `https://127.0.0.1:8000${productDetails.images[0].sub_image_1}`
            }
              alt="Sub Image 1"
              className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
            />
            <img
            src={
              productDetails.images &&
              productDetails.images.length > 0 &&
              `https://127.0.0.1:8000${productDetails.images[0].sub_image_2}`
            }
              alt="Sub Image 2"
              className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
            />
            <img
            src={
              productDetails.images &&
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
      { label: "Product Name", placeholder: "Pant", value: productDetails?.product?.product_name || "" },
      { label: "Product Description", placeholder: "", value: productDetails?.product?.product_description || "" },
      { label: "Category", placeholder: "", value: productDetails.category?.category_name || "" },
      { label: "Brand", placeholder: "", value: productDetails.brand?.brand_name || "" },
      { label: "Shop", placeholder: "", value: productDetails.shop?.shop_name || "" },
      { label: "Model Height", placeholder: "", value: productDetails.product?.model_height || "" },
      { label: "Model Wearing", placeholder: "", value: productDetails.product?.model_wearing || "" },
      { label: "Care Instruction", placeholder: "", value: productDetails.product?.care_instructions || "" },
      { label: "About", placeholder: "", value: productDetails.product?.about || "" },
      { label: "Color", placeholder: "", value: productDetails.color?.color_name || "" },
      { label: "Size", placeholder: "", value: productDetails.size?.size_name || "" },
      { label: "Quantity in Stock", placeholder: "", value: productDetails?.quantity_in_stock || "" },
      { label: "Original Price", placeholder: "", value: productDetails?.original_price || "" },
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
        <div key="" className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
        Sales Price
        </label>
        <input
          type="text"
          placeholder="Enter the Sales Price"
          // value={saleprice}
          // onChange={(e)=>setSalesprice(e.target.value)}
          className="border-2 border-green-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
         
        />
      </div>
      <div key="" className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
        Reject Reason <strong className='text-red-600'>If you reject, please select a reason:</strong>
        </label>
        <select
          // value={reason}
          // onChange={(e)=>setReason(e.target.value)}
          className="border-2 border-red-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          <option value="" disabled>
            Select a reason
          </option>
          <option value="Inappropriate content">Inappropriate content</option>
          <option value="Incorrect product details">Incorrect product details</option>
          <option value="Poor quality images">Poor quality images</option>
          <option value="Pricing issue">Pricing issue</option>
          <option value="Duplicate product">Duplicate product</option>
          <option value="Other">Other</option>
        </select>
        
      </div>
      <div key="" className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
        Product Code
        </label>
        <input
          type="text"
          placeholder="Enter the Product Code.."
          // value={code}
          // onChange={(e)=>setCode(e.target.value)}
          className="border-2 border-green-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          
        />
      </div>
  
  </div>
  
  
        {/* Buttons */}
      </div>
    </div>
)}



      
    </div>
  );
};

export default ProductsSection;
