import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ViewDetailedOrder from "./OrderComponents/ViewDetailedOrder";
const OrdersSection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [orders,setOrders]=useState([]);
    const [currentView,setCurrentView]=useState("neworders");

        const fetchOrders=async(status)=>{
        console.log("STA",status);

      try{
        const response=await axios.get(`https://127.0.0.1:8000/api/seller/seller_view_orders/`,{
          headers:{
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":'application/json',
          }
        });
       
          console.log("EEE",response.data);
          setOrders(response.data);

      }
      catch(errors)
      {
        console.log(errors);
      }
    }

useEffect(()=>{
    fetchOrders();
},[])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Orders</span>
        </h1>
      </div>

      {/* Overview Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: "New Orders", count: 24, color: "bg-blue-500" },
          { title: "Shipped Orders", count: 56, color: "bg-green-500" },
          { title: "Cancelled Orders", count: 5, color: "bg-red-500" },
        ].map((card, index) => (
          <div
            key={index}
            className={`rounded-lg shadow-md p-4 ${card.color} text-white`}
          >
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="text-2xl font-bold">{card.count}</p>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search Orders"
            className="flex-grow p-2 border rounded-md shadow-sm"
          />
          <div className="flex gap-2">
            <button onClick={()=>setCurrentView("neworders")} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md">
              New Orders
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
              Shipped Orders
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md">
              Cancelled Orders
            </button>
          </div>
        </div>
      </div>

  {
    currentView ==="neworders" && (
           
      <div className="p-6 bg-white shadow-md rounded-lg">
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 border">Order ID</th>
              <th className="p-4 border">Customer Name</th>
              <th className="p-4 border">Order Date</th>
              <th className="p-4 border">Status</th>
              <th className="p-4 border">Amount</th>
              <th className="p-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4 border">ORD-{item.order.id}</td>
                <td className="p-4 border">{item.order.user.first_name}</td>
                <td className="p-4 border">{item.order.order_date}</td>
                <td className="p-4 border">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {item.order.order_status.status}
                  </span>
                </td>
                <td className="p-4 border">${item.price*item.quantity}</td>
                <td className="p-4 border">

<button onClick={()=>setCurrentView({view:"shippedorders",data:item})}  className="px-2 py-1 bg-blue-600 rounded-md hover:bg-blue-700 text-white">View Order</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    )

  } 

  {
    currentView.view === "shippedorders" && (
      <ViewDetailedOrder currentView={currentView}/>
    )
  }


    </div>
  );
};

export default OrdersSection;
