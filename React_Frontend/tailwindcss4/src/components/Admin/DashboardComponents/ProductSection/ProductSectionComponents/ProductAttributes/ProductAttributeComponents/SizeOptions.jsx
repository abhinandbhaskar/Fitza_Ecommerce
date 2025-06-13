import axios from "axios";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import { safe } from "../../../../../../../utils/safeAccess";
const SizeOptions = () => {
  const[size,setSize]=useState("");
  const[sortOrder,setSortOrder]=useState("");
  const {accessToken}=useSelector((state)=>state.auth);
  const[sizearr,setSizearr]=useState([]);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const sizeData={
      size:size.trim(),
      order:sortOrder.trim()
    }
    console.log(sizeData);

    try{
      const response=await axios.post("https://127.0.0.1:8000/api/admin/add_size/",sizeData,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      fetchSize();
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.data.response);
    }
  }

  const fetchSize=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/admin/view_size/",{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      setSizearr(response.data);
     
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }

  useEffect(()=>{
    fetchSize();
  },[])

  const handleDelete=async(size_id)=>{
   try{
    const response=await axios.delete(`https://127.0.0.1:8000/api/admin/delete_size/${size_id}/`,{
      headers:{
        Authorization:`Bearer ${accessToken}`,
      }
    });
    console.log(response);
    console.log(response.data);
    alert(response.data.message);
    fetchSize();
   }
   catch(errors)
   {
    console.log(errors);
    console.log(errors.response.data);
   }
  }

  return (
    <div className="h-auto w-full bg-blue-100 p-4 flex flex-col md:flex-row gap-4">
      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-4 flex-1">
        <h2 className="text-xl font-semibold mb-4">Size Options</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border-b">No.</th>
              <th className="p-2 border-b">Size</th>
              <th className="p-2 border-b">Priority</th>
              <th className="p-2 border-b text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              sizearr.map((size,key)=>(
                <tr>
                <td className="p-2 border-b">{key+1}</td>
                <td className="p-2 border-b">{safe(size,'size_name')}</td>
                <td className="p-2 border-b">{safe(size,'sort_order')}</td>
                <td className="p-2 border-b text-right">
                  <button onClick={()=>handleDelete(size.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                    Delete
                  </button>
                </td>
              </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Form Section */}
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3">
  <h2 className="text-xl font-semibold mb-4">Add New Size</h2>
  <form className="flex flex-col gap-4">
    {/* Size Field */}
    <div>
      <label htmlFor="size" className="block font-medium mb-1">
        Size
      </label>
      <input
        id="size"
        type="text"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter size (e.g., S, M, L)"
        value={size}
        onChange={(e)=>setSize(e.target.value)}
      />
    </div>

    {/* Sort Order Field */}
    <div>
      <label htmlFor="sortOrder" className="block font-medium mb-1">
        Sort Order
      </label>
      <input
        id="sortOrder"
        type="number"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter sort order"
        value={sortOrder}
        onChange={(e)=>setSortOrder(e.target.value)}
      />
    </div>

    {/* Submit Button */}
    <button
      onClick={handleSubmit}
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
    >
      Submit
    </button>
  </form>
</div>

    </div>
  );
};

export default SizeOptions;
