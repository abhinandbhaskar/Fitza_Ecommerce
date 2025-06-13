import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux";
import { safe } from '../../../../../../../utils/safeAccess';
const BrandOptions = () => {
  const[view,setView]=useState("add");
  const[brand,setBrand]=useState("");
  const[description,setDescription]=useState("");
  const {accessToken}=useSelector((state)=>state.auth);
  const[brandarr,setBrandarr]=useState([]);

  const[brand1,setBrand1]=useState("");
  const[description1,setDescription1]=useState("");
  const[brand_id1,setBrand_id1]=useState("");

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const brandData={
      brand:brand.trim(),
      description:description.trim()
    }
    console.log(brandData);
    console.log(accessToken);
    try{
      const response=await axios.post("https://127.0.0.1:8000/api/admin/add_brand/",brandData,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      fetchBrand();
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  const fetchBrand=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/admin/view_brand/",{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      setBrandarr(response.data);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  useEffect(()=>{
    fetchBrand();
  },[])

  const handleUpdate=async(brand_id)=>{
    setView("update")
    console.log(brand_id);
    try{
      const response=await axios.get(`https://127.0.0.1:8000/api/admin/view_update_brand/${brand_id}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      console.log(response);
      console.log(response.data);
      setBrand1(response.data.brand_name);
      setDescription1(response.data.brand_description);
      setBrand_id1(response.data.id);

    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  const handleUpdateBrand=async(brand_id1)=>{
    console.log(brand_id1);
    console.log("VVVV");
    console.log("Brand",brand1);
    console.log("Des",description1);

    const formData=new FormData();
    formData.append("brand",brand1);
    formData.append("description",description1);
 
    try{
      const response=await axios.put(`https://127.0.0.1:8000/api/admin/update_brand/${brand_id1}/`,formData,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      fetchBrand();
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }

  }

  const handleDelete=async(brand_id)=>{
    console.log(brand_id);
    try{
      const response=await axios.delete(`https://127.0.0.1:8000/api/admin/delete_brand/${brand_id}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      fetchBrand();
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  return (
    <div className="h-auto w-full bg-violet-100 p-4 flex flex-col md:flex-row gap-4">
    
      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-4 flex-1">

        <div className='flex justify-between'>
           <h2 className="text-xl font-semibold mb-4">Brand Options</h2>
            {
          view==="update"&&(
      <div>
        <button onClick={()=>setView("add")} className='bg-blue-500 px-2 py-1 text-white rounded-md'>Add brand</button>
      </div>
          )
        }
        </div>
       

       
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border-b">No.</th>
              <th className="p-2 border-b">Brand</th>
              <th className="p-2 border-b">Brand Description</th>
              <th className="p-2 border-b text-right">Action</th>
              <th className="p-2 border-b text-right">Action</th>
            </tr>
          </thead>
          <tbody>
          {
            brandarr.map((brand,key)=>(
            <tr>
              <td className="p-2 border-b">{key+1}</td>
              <td className="p-2 border-b">{safe(brand,'brand_name')}</td>
              <td className="p-2 border-b">{safe(brand,'brand_description')}</td>
              <td className="p-2 border-b text-right">
                <button onClick={()=>handleUpdate(brand.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Update
                </button>
              </td>
              <td className="p-2 border-b text-right">
                <button onClick={()=>handleDelete(brand.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                  Delete
                </button>
              </td>
            </tr>
            ))
          }

          </tbody>
        </table>
      </div>

   {view==="add" &&
     (
        <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add New Brand</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="size" className="block font-medium mb-1">
              Brand
            </label>
            <input
              id="size"
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Brand Name"
              value={brand}
              onChange={(e)=>setBrand(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="size" className="block font-medium mb-1">
              Brand Description
            </label>
            <textarea
              id="size"
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter about brand"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />
          </div>
          <button
            type="button" onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
     )
   }
   {
    view==="update" && (
    
        <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Update Brand</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="size" className="block font-medium mb-1">
              Brand
            </label>
            <input
              id="size"
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Brand Name"
              value={brand1}
              onChange={(e)=>setBrand1(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="size" className="block font-medium mb-1">
              Brand Description
            </label>
            <textarea
              id="size"
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter about brand"
              value={description1}
              onChange={(e)=>setDescription1(e.target.value)}
            />
          </div>
          <button
            onClick={()=>handleUpdateBrand(brand_id1)}
            type="button" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Update
          </button>
        </form>
      </div>
    )
   }
      
    </div>
  )
}

export default BrandOptions
