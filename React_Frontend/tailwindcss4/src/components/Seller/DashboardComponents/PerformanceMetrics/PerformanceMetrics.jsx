import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const PerformanceMetrics = () => {

  const salesData = {
    daily: [1200, 1900, 1700, 2100, 2500, 2200, 2800],
    weekly: [12500, 13900, 14700, 16200, 18500, 17200, 19800],
    monthly: [52000, 68000, 75000, 82000, 89000, 97000, 105000],
  };

  const topProducts = [
    { name: "Premium Sneakers", sales: 342, revenue: "$8,550" },
    { name: "Yoga Mat Pro", sales: 278, revenue: "$6,950" },
    { name: "Wireless Earbuds", sales: 195, revenue: "$4,875" },
    { name: "Fitness Tracker", sales: 168, revenue: "$3,360" },
    { name: "Water Bottle", sales: 142, revenue: "$1,420" },
  ];

  // Chart data configuration
  const timePeriodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Sales',
        data: salesData.daily,
        borderColor: 'rgba(79, 70, 229, 1)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const salesTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Sales Trend (Last 6 Weeks)',
        data: [12500, 13900, 14700, 16200, 18500, 19800],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Performance Metrics</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Daily
          </button>
          <button className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
            Weekly
          </button>
          <button className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
            Monthly
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Time Period Sales */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Sales Overview</h3>
            <div className="h-64">
              <Line 
                data={timePeriodData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Sales Trend */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Sales Trend (Last 6 Weeks)</h3>
            <div className="h-64">
              <Line 
                data={salesTrendData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4 h-full">
          <h3 className="text-md font-medium text-gray-700 mb-3">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-lg font-medium text-gray-500 mr-3 mt-1">{index + 1}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800">{product.name}</h4>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{product.sales} sales</span>
                    <span className="text-xs font-medium text-green-600">{product.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors">
            View All Products →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
