import React, { useEffect, useState } from 'react'
import axios from "axios";
import {useSelector} from "react-redux"
const ColorOptions = () => {
  const[color,setColor]=useState("");
  const {accessToken}=useSelector((state)=>state.auth);
  const[colorarr,setColorarr]=useState([]);
  const hanldeSubmit=async(e)=>{
    e.preventDefault();
    console.log(color);
    const data={
      color:color.trim(),
    }

    try{
      const response=await axios.post("https://127.0.0.1:8000/api/admin/add_color/",data,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      fetchColor();
    }
    catch(errors)
    {
      console.log(errors);
      console.log(errors.data.response);
    }

  }
  const fetchColor=async()=>{
    try{
      const response=await axios.get("https://127.0.0.1:8000/api/admin/view_colors/",{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      setColorarr(response.data);
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }
  }
  useEffect(()=>{
    fetchColor();
  },[])

  const handleDelete=async(color_id)=>{
      console.log(color_id);
      try{
        const response=await axios.delete(`https://127.0.0.1:8000/api/admin/delete_color/${color_id}/`,{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
        }
        );
        console.log(response);
        console.log(response.data);
        if(response.data.status=200)
          {
            alert(response.data.message);
            fetchColor();
          }
      }
      catch(errors)
      {
        console.log(errors);
        console.log(errors.response.data);
      }
  }

  return (
    <div className="h-screen w-full bg-gray-100 p-4 flex flex-col md:flex-row gap-4">
      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-4 flex-1">
        <h2 className="text-xl font-semibold mb-4">Color Options</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border-b">#</th>
              <th className="p-2 border-b">Color</th>
              <th className="p-2 border-b text-right">Action</th>
            </tr>
          </thead>
          <tbody>
{
  colorarr.map((colors,key)=>(
    <tr value={key}>
    <td className="p-2 border-b">#{colors.id}</td>
    <td className="p-2 border-b">{colors.color_name}</td>
    <td className="p-2 border-b text-right">
      <button onClick={()=>handleDelete(colors.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
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
        <h2 className="text-xl font-semibold mb-4">Add New Color</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="size" className="block font-medium mb-1">
              Color
            </label>
            <input
              id="size"
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter size (e.g., Blue,Red, Yellow)"
              value={color}
              onChange={(e)=>setColor(e.target.value)}
            />
          </div>
          <button onClick={hanldeSubmit}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default ColorOptions
