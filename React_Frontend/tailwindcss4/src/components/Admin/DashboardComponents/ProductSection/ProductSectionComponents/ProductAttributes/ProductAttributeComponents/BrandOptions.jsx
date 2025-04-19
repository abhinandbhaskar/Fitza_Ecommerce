import React, { useState } from 'react'

const BrandOptions = () => {
  const[view,setView]=useState("add");
  return (
    <div className="h-screen w-full bg-gray-100 p-4 flex flex-col md:flex-row gap-4">
      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-4 flex-1">
        <h2 className="text-xl font-semibold mb-4">Brand Options</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border-b">#</th>
              <th className="p-2 border-b">Brand</th>
              <th className="p-2 border-b">Brand Description</th>
              <th className="p-2 border-b text-right">Action</th>
              <th className="p-2 border-b text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-b">1</td>
              <td className="p-2 border-b">Adidas</td>
              <td className="p-2 border-b">World Number one brand</td>
              <td className="p-2 border-b text-right">
                <button onClick={()=>setView("update")} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Update
                </button>
              </td>
              <td className="p-2 border-b text-right">
                <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                  Delete
                </button>
              </td>
            </tr>
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
            />
          </div>
          <button
            type="submit"
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
            />
          </div>
          <button
            type="submit"
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
