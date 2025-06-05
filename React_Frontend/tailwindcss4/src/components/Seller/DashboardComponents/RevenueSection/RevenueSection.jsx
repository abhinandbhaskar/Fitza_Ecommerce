import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
const RevenueSection = () => {
  // Sample data - in a real app, this would come from an API

  const {accessToken} = useSelector((state)=>state.auth);
  const [recentOrders,setRecentOrders]=useState([]);

  const fetchRevenue = async()=>{

    try{
      const response = await axios.get("https://127.0.0.1:8000/api/seller/view_seller_revenue/",{
          headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log("REs",response);
      console.log("REs",response.data);
      setRecentOrders(response.data);
    }catch(errors)
    {
      console.log(errors);
    }

  }

  useEffect(()=>{
  fetchRevenue();
  },[]);


  const metrics = [
    { title: 'Total Revenue', value: '$12,845.50', change: '+12%', trend: 'up' },
    { title: 'Orders Processed', value: '1,284', change: '+5%', trend: 'up' },
    { title: 'Refunds Issued', value: '$845.20', change: '-2%', trend: 'down' },
    { title: 'Pending Payments', value: '$2,154.00', change: '+8%', trend: 'up' },
  ];


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Revenue</span>
        </h1>
      </div>

      <div className="p-6">
        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">{metric.title}</h3>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                <span className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium 
                  ${metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Graphical Representations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Over Time Chart */}
          <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Revenue Over Time</h2>
              <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Line chart would appear here</p>
            </div>
          </div>

          {/* Top-Selling Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top-Selling Products</h2>
            <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Bar chart would appear here</p>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Category Performance</h2>
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Pie chart would appear here</p>
          </div>
        </div>

        {/* Order List with Filters */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Recent Orders</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm">
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Refunded</option>
              </select>
              <input 
                type="date" 
                className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm"
              />
              <button className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.order.order_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.order.user.first_name+order.order.user.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs.{order.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                          order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Export</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                  <span className="font-medium">24</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    &lt;
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    &gt;
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-6 flex justify-end space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
            Export as CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;