import React, { useState } from "react";
import "./MyOrders.css";

const MyOrders = ({setCurrentView}) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const handleFilterClick = (filter) => setActiveFilter(filter);

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <i className="fa-solid fa-cart-shopping text-4xl text-blue-500"></i>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Product Name or Order ID"
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`py-2 px-4 rounded-lg shadow-md font-medium ${
                activeFilter === filter
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((order) => (
              <tr key={order} className="border-t hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-800">
                  <a href={`/order/${order}`} className="text-blue-500 hover:underline">
                    #160{order}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 flex items-center gap-2">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Product"
                    className="w-10 h-10 rounded"
                  />
                  <span>Product Name {order}</span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span className="text-green-600">Delivered</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">Rs. {order * 10000}</td>
                <td className="px-6 py-4 text-sm text-gray-800">Rs. {order * 10000}</td>
                <td className="px-6 py-4 text-sm text-gray-800 flex gap-2">
                  <button onClick={()=>setCurrentView("orderdetails")} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                    View
                  </button>
                  <button className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md">
                    Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
