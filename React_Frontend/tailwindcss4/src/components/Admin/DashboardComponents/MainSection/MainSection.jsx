import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const MainSection = () => {
  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  const revenueData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home Goods', value: 200 },
    { name: 'Beauty', value: 100 },
  ];

  const topProductsData = [
    { name: 'Wireless Earbuds', sales: 240 },
    { name: 'Smart Watch', sales: 189 },
    { name: 'Bluetooth Speaker', sales: 156 },
    { name: 'Fitness Tracker', sales: 132 },
    { name: 'Phone Case', sales: 98 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      {/* Header Section */}
      <div className="bg-amber-500 rounded-lg shadow-md mb-4">
          <div className="bg-white border border-gray-300 flex items-center px-6 py-3 rounded-t-lg">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard &gt;</h1>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-800 p-4 flex gap-4 rounded-b-lg">
              <div className="grid grid-cols-3 gap-4 flex-grow">
                  {[
                      { title: "Total Users", count: 277, bgColor: "bg-green-500" },
                      { title: "Total Sellers", count: 277, bgColor: "bg-pink-500" },
                      { title: "Total Orders", count: 277, bgColor: "bg-violet-500" },
                      { title: "Total Products", count: 277, bgColor: "bg-blue-500" },
                      { title: "Total Revenue", count: 277, bgColor: "bg-yellow-500" },
                      { title: "Total Reviews", count: 277, bgColor: "bg-red-500" },
                  ].map((stat, index) => (
                      <div
                          key={index}
                          className={`h-40 flex flex-col items-start justify-center p-4 rounded-2xl shadow-md ${stat.bgColor}`}
                      >
                          <h1 className="text-white text-lg font-semibold">{stat.title}</h1>
                          <h3 className="text-white text-3xl font-bold">{stat.count}</h3>
                      </div>
                  ))}
              </div>

              <div className="w-1/4 bg-orange-300 rounded-2xl shadow-md flex items-center justify-center text-xl font-semibold text-gray-700">
                  Total Sales
              </div>
          </div>
      </div>
      
      {/* Analytics and Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Sales Trends (Line Chart) */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-chart-line mr-2 text-blue-500"></i>
              Sales Trends
            </h2>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Sales ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Revenue Breakdown (Pie Chart) */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-chart-pie mr-2 text-purple-500"></i>
            Revenue Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top-Selling Products */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-star mr-2 text-yellow-500"></i>
          Top-Selling Products
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topProductsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="name" type="category" stroke="#888" width={100} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [`${value} units`, 'Sales']}
              />
              <Legend />
              <Bar dataKey="sales" fill="#10b981" name="Units Sold" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Notifications Panel */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-bell mr-2 text-red-500"></i>
            Notifications
          </h2>
          <button className="text-sm text-blue-500 hover:text-blue-700">
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* Pending Approvals */}
          <div className="p-4 hover:bg-gray-50 flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <i className="fas fa-clock text-yellow-500"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Pending Approvals</h3>
              <p className="text-sm text-gray-500">5 new seller applications waiting for review</p>
            </div>
            <button className="text-sm text-blue-500">View</button>
          </div>
          
          {/* Flagged Issues */}
          <div className="p-4 hover:bg-gray-50 flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <i className="fas fa-flag text-red-500"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Flagged Issues</h3>
              <p className="text-sm text-gray-500">3 products reported by users</p>
            </div>
            <button className="text-sm text-blue-500">View</button>
          </div>
          
          {/* Refund Alerts */}
          <div className="p-4 hover:bg-gray-50 flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <i className="fas fa-exchange-alt text-purple-500"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Refund Alerts</h3>
              <p className="text-sm text-gray-500">7 refund requests pending processing</p>
            </div>
            <button className="text-sm text-blue-500">View</button>
          </div>
          
          {/* Return Alerts */}
          <div className="p-4 hover:bg-gray-50 flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <i className="fas fa-undo text-blue-500"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Return Alerts</h3>
              <p className="text-sm text-gray-500">4 return requests need attention</p>
            </div>
            <button className="text-sm text-blue-500">View</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainSection;