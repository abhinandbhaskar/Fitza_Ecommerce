import React from 'react';
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
  // Sample data - in a real app, this would come from an API
  const platformMetrics = {
    totalRevenue: 1254300,
    activeSellers: 42,
    refundedAmount: 87500,
    platformCommission: 187500,
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
  const topSellers = [
    { name: 'Seller A', revenue: 320000, orders: 1250, refunds: 12000, commission: 48000 },
    { name: 'Seller B', revenue: 280000, orders: 980, refunds: 8500, commission: 42000 },
    { name: 'Seller C', revenue: 195000, orders: 750, refunds: 6200, commission: 29250 },
    { name: 'Seller D', revenue: 175000, orders: 680, refunds: 5800, commission: 26250 },
    { name: 'Seller E', revenue: 125000, orders: 520, refunds: 4200, commission: 18750 },
  ];

  // Category distribution data
  const categoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Fashion', value: 25 },
    { name: 'Home & Garden', value: 15 },
    { name: 'Sports', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
              ${(platformMetrics.totalRevenue / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Active Sellers</h3>
            <p className="text-2xl font-bold text-green-600">{platformMetrics.activeSellers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Refunded Amount</h3>
            <p className="text-2xl font-bold text-red-600">
              ${(platformMetrics.refundedAmount / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Platform Commission</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${(platformMetrics.platformCommission / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded">
              <h3 className="text-gray-500 text-sm font-medium">Gross Revenue</h3>
              <p className="text-xl font-bold">${(platformMetrics.totalRevenue / 1000).toFixed(1)}K</p>
            </div>
            <div className="border p-4 rounded">
              <h3 className="text-gray-500 text-sm font-medium">Refunds & Discounts</h3>
              <p className="text-xl font-bold">${(platformMetrics.refundedAmount / 1000).toFixed(1)}K</p>
            </div>
            <div className="border p-4 rounded bg-indigo-50">
              <h3 className="text-gray-700 text-sm font-medium">Net Revenue</h3>
              <p className="text-xl font-bold text-indigo-700">
                ${((platformMetrics.totalRevenue - platformMetrics.refundedAmount) / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Over Time */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Platform Revenue Over Time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue by Category</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Sellers Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue by Top Sellers</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seller Performance Table */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Seller Performance</h2>
            <div className="flex space-x-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
              <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
                Export
              </button>
            </div>
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
                      {seller.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(seller.revenue / 1000).toFixed(1)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {seller.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${seller.refunds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(seller.commission / 1000).toFixed(1)}K
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
