import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { safe } from "../../../../utils/safeAccess";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RevenueSection = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [totalrevenue,setTotalRevenue]=useState(0);
  const [refundAmount,setRefundAmount]=useState(0);
  const [adminearnings,setAdminEarnings]=useState(0);
  const [activesellers,setActiveSellers]=useState(0);
  const [topSellers,setTopSellers]=useState([]);


  
      const fetchRevenue = async () => {
          try {
              const response = await axios.get("https://127.0.0.1:8000/api/admin/view_admin_revenue/", {
                  headers: {
                      Authorization: `Bearer ${accessToken}`,
                  },
              });
              console.log("REs", response);
              console.log("REs", response.data);
              setTotalRevenue(response.data["overview"].total_revenue);
              setRefundAmount(response.data["overview"].refund_amount);
              setAdminEarnings(response.data["overview"].admin_earnings);
              setActiveSellers(response.data["overview"].active_sellers);
              setTopSellers(response.data.seller_stats)
              console.log("topSellers",response.data.seller_stats);
         
          } catch (errors) {
              console.log(errors);
          }
      };
  
      useEffect(() => {
          fetchRevenue();
      }, []);
  
  



  const platformMetrics = {
    totalRevenue: totalrevenue,
    activeSellers: activesellers,
    refundedAmount: refundAmount,
    platformCommission: adminearnings,
  };

  // Revenue over time data
  const revenueOverTime = [
    { month: 'Jan', revenue: 95000 },
    { month: 'Feb', revenue: 110000 },
    { month: 'Mar', revenue: 125000 },
    { month: 'Apr', revenue: 150000 },
    { month: 'May', revenue: 180000 },
    { month: 'Jun', revenue: 210000 },
    { month: 'Jul', revenue: 195000 },
    { month: 'Aug', revenue: 220000 },
    { month: 'Sep', revenue: 240000 },
  ];

  // Top sellers data

  // Category distribution data






  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Revenue</span>
        </h1>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Platform Revenue</h3>
            <p className="text-2xl font-bold text-indigo-600">
              ₹{(platformMetrics.totalRevenue / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Active Sellers</h3>
            <p className="text-2xl font-bold text-green-600">{platformMetrics.activeSellers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Refunded Amount</h3>
            <p className="text-2xl font-bold text-red-600">
               ₹{(platformMetrics.refundedAmount / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Platform Commission</h3>
            <p className="text-2xl font-bold text-purple-600">
               ₹{(platformMetrics.platformCommission / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded">
              <h3 className="text-gray-500 text-sm font-medium">Gross Revenue</h3>
              <p className="text-xl font-bold"> ₹{(platformMetrics.totalRevenue / 1000).toFixed(1)}K</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="text-gray-500 text-sm font-medium">Refunds & Discounts</h3>
              <p className="text-xl font-bold"> ₹{(platformMetrics.refundedAmount / 1000).toFixed(1)}K</p>
            </div>
            <div className="border p-4 rounded bg-indigo-50">
              <h3 className="text-gray-700 text-sm font-medium">Net Revenue</h3>
              <p className="text-xl font-bold text-indigo-700">
                 ₹{((platformMetrics.totalRevenue - platformMetrics.refundedAmount) / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

   

        {/* Top Sellers Bar Chart */}
<div className="bg-white p-4 rounded-lg shadow mb-6">
  <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue by Top Sellers</h2>
  <div className="h-64">
    {topSellers?.length > 0 ? (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[...topSellers].sort((a, b) => b.final_revenue - a.final_revenue)}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="seller_name"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
          <Tooltip
            formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
            labelFormatter={(name) => `Seller: ${name}`}
          />
          <Legend />
          <Bar dataKey="gross_revenue" fill="#4f46e5" name="Gross Revenue" />
          <Bar dataKey="final_revenue" fill="#10b981" name="Net Revenue" />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No seller data available</p>
      </div>
    )}
  </div>
</div>

        {/* Seller Performance Table */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Seller Performance</h2>
            {/* <div className="flex space-x-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
              <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
                Export
              </button>
            </div> */}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refunds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
               {topSellers.map((seller, index) => (
        <tr key={index}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {seller.seller_name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ₹{seller.final_revenue?.toFixed(2) || '0.00'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {seller.total_orders}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ₹{seller.total_refunds?.toFixed(2) || '0.00'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ₹{seller.total_commission?.toFixed(2) || '0.00'}
          </td>
        </tr>
      ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;
