import React from 'react';

const InventoryManagement = () => {
  // Sample data - replace with your actual data
  const lowStockProducts = [
    { id: 'PRD-842', name: 'Premium Yoga Mat', stock: 3, threshold: 10, salesRate: 'High' },
    { id: 'PRD-756', name: 'Resistance Bands Set', stock: 5, threshold: 15, salesRate: 'Medium' },
    { id: 'PRD-921', name: 'Wireless Earbuds', stock: 2, threshold: 8, salesRate: 'Very High' },
    { id: 'PRD-635', name: 'Protein Shaker Bottle', stock: 4, threshold: 12, salesRate: 'Medium' },
  ];

  const outOfStockProducts = [
    { id: 'PRD-312', name: 'Fitness Tracker Watch', lastSold: '3 days ago', demand: 'High' },
    { id: 'PRD-478', name: 'Adjustable Dumbbells', lastSold: '1 week ago', demand: 'Medium' },
    { id: 'PRD-129', name: 'Compression Socks', lastSold: '2 days ago', demand: 'Very High' },
  ];

  const inventoryValue = {
    total: 28450,
    categories: [
      { name: 'Fitness Equipment', value: 12500, trend: 'up' },
      { name: 'Wearables', value: 8200, trend: 'down' },
      { name: 'Supplements', value: 4500, trend: 'up' },
      { name: 'Accessories', value: 3250, trend: 'up' },
    ]
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Inventory Management</h2>
        <p className="text-sm text-gray-500 mt-1">Monitor and optimize your product inventory</p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <div className="border border-orange-200 rounded-lg shadow-xs overflow-hidden lg:col-span-2">
          <div className="bg-orange-50 px-4 py-3 border-b border-orange-200 flex items-center">
            <i className="fa-solid fa-triangle-exclamation text-orange-600 mr-2"></i>
            <h3 className="text-md font-medium text-gray-800">Low Stock Alerts</h3>
            <span className="ml-auto bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {lowStockProducts.length} products
            </span>
          </div>
          <div className="divide-y divide-orange-100">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="p-4 hover:bg-orange-50 transition-colors grid grid-cols-4 items-center">
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.id}</p>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs font-medium mr-2 ${
                    product.salesRate === 'Very High' ? 'text-red-600' : 
                    product.salesRate === 'High' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {product.salesRate} sales
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-sm font-bold text-orange-600 mr-2">{product.stock} left</span>
                  <button className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition-colors">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-orange-50 border-t border-orange-200 text-right">
            <button className="text-sm font-medium text-orange-600 hover:text-orange-800">
              View all low stock items →
            </button>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="border border-blue-200 rounded-lg shadow-xs overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 flex items-center">
            <i className="fa-solid fa-dollar-sign text-blue-600 mr-2"></i>
            <h3 className="text-md font-medium text-gray-800">Inventory Value</h3>
          </div>
          <div className="p-4">
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold text-gray-900">${inventoryValue.total.toLocaleString()}</span>
              <span className="text-sm text-green-600 ml-2 flex items-center">
                <i className="fa-solid fa-arrow-trend-up mr-1"></i> 8.2%
              </span>
            </div>
            
            <div className="space-y-3">
              {inventoryValue.categories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{category.name}</span>
                    <span className="font-medium">${category.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${(category.value / inventoryValue.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 bg-blue-50 border-t border-blue-200 text-right">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View detailed breakdown →
            </button>
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="border border-red-200 rounded-lg shadow-xs overflow-hidden lg:col-span-2">
          <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex items-center">
            <i className="fa-solid fa-box-open text-red-600 mr-2"></i>
            <h3 className="text-md font-medium text-gray-800">Out of Stock</h3>
            <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {outOfStockProducts.length} products
            </span>
          </div>
          <div className="divide-y divide-red-100">
            {outOfStockProducts.map((product, index) => (
              <div key={index} className="p-4 hover:bg-red-50 transition-colors grid grid-cols-3 items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.id}</p>
                </div>
                <div className="text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.demand === 'Very High' ? 'bg-red-100 text-red-800' :
                    product.demand === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.demand} demand
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                    Restock
                  </button>
                  <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-red-50 border-t border-red-200 text-right">
            <button className="text-sm font-medium text-red-600 hover:text-red-800">
              View all out of stock items →
            </button>
          </div>
        </div>

        {/* Inventory Health */}
        <div className="border border-green-200 rounded-lg shadow-xs overflow-hidden">
          <div className="bg-green-50 px-4 py-3 border-b border-green-200 flex items-center">
            <i className="fa-solid fa-chart-pie text-green-600 mr-2"></i>
            <h3 className="text-md font-medium text-gray-800">Inventory Health</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Stock Turnover</p>
                <p className="text-xl font-bold text-gray-800">3.2</p>
                <p className="text-xs text-green-600 flex items-center">
                  <i className="fa-solid fa-arrow-trend-up mr-1"></i> Improved from last month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <i className="fa-solid fa-chart-pie text-green-600 text-xl"></i>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Optimal Stock Ratio</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Excess Inventory</span>
                  <span className="font-medium">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-yellow-500" style={{ width: '12%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Stockout Risk</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-green-50 border-t border-green-200 text-right">
            <button className="text-sm font-medium text-green-600 hover:text-green-800">
              View recommendations →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;