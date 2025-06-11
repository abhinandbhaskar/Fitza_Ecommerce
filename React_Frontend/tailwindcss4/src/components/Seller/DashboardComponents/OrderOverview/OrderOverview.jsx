import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderOverview = ({setCurrentView}) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [ordersInProgress,setordersInProgress]=useState([]);
  const [pendingOrders,setpendingOrders]=useState([]);
  const [returnedOrders,setreturnedOrders]=useState([]);

  // Sample data - replace with your actual data


      const fetchOrders = async () => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/seller/seller_dashboard_orders/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("EEE", response.data);
            setordersInProgress(response.data.processingorders)
            setpendingOrders(response.data.pendingorders)
            setreturnedOrders(response.data.returnrefund);
          
        } catch (errors) {
            console.log(errors);
        }
    };

    useEffect(()=>{
      fetchOrders();
    },[])

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Order Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Manage and track all order activities</p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders in Progress */}
        <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden">
          <div className="bg-indigo-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <i className="fa-solid fa-box-open text-indigo-600 mr-2"></i>
            <h3 className="text-md font-medium text-gray-800">Orders in Progress</h3>
            <span className="ml-auto bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              {ordersInProgress.length} active
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {ordersInProgress.map((order, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#ORD-{order.id}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.customer}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-xs text-gray-500 flex items-center">
                    <i className="fa-regular fa-clock mr-1"></i> {order.date}d ago
                  </span>
                  <span className="text-xs font-medium">
                    {/* {order.items} item{order.items !== 1 ? 's' : ''} */}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-right">
            <button onClick={()=>setCurrentView("orders")} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              View all in-progress orders →
            </button>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden">
          <div className="bg-amber-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <i className="fa-solid fa-triangle-exclamation text-amber-600 mr-2"></i>
            <h3 className="text-md font-medium text-gray-800">Pending Action</h3>
            <span className="ml-auto bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {pendingOrders.length} require attention
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingOrders.map((order, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#ORD-{order.id}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.customer}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                    Action required
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-700 font-medium">{order.status}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">{order.date}</span>
                    <button className="text-xs font-medium text-amber-600 hover:text-amber-800">
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-right">
            <button onClick={()=>setCurrentView("orders")} className="text-sm font-medium text-amber-600 hover:text-amber-800">
              View all pending orders →
            </button>
          </div>
        </div>

        {/* Returned/Refunded Orders */}
        <div className="border border-gray-200 rounded-lg shadow-xs overflow-hidden">
          <div className="bg-red-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <i className="fa-solid fa-rotate-left text-red-600 mr-2"></i>
            <h3 className="text-md font-medium text-gray-800">Returns & Refunds</h3>
            <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {returnedOrders.length} cases
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {returnedOrders.map((order, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#ORD-{order.id}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.customer}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status.includes('Refund') 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-700">Reason: {order.reason}</p>
                  <div className="flex justify-between mt-2 items-center">
                    <span className="text-xs font-medium">Rs.{order.amount}</span>
                    <div className="flex space-x-2">
                      <button className="text-xs p-1 text-gray-500 hover:text-gray-700">
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button className="text-xs p-1 text-gray-500 hover:text-gray-700">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-right">
            <button onClick={()=>setCurrentView("returnrefund")} className="text-sm font-medium text-red-600 hover:text-red-800">
              View all returns →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;