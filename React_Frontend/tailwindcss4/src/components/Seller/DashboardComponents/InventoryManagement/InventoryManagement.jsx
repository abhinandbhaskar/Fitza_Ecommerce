import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const InventoryManagement = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [inventoryData, setInventoryData] = useState({
    inventory_data: [],
    inventory_value: {
      total: 0,
      categories: []
    },
    low_stock_products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://127.0.0.1:8000/api/seller/inventory_data/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setInventoryData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
        <div className="text-center py-10">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchInventoryData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              {inventoryData.low_stock_products.length} products
            </span>
          </div>
          <div className="divide-y divide-orange-100">
            {inventoryData.low_stock_products.length > 0 ? (
              inventoryData.low_stock_products.map((product, index) => (
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
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No low stock products at this time
              </div>
            )}
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
              <span className="text-3xl font-bold text-gray-900">
                ${inventoryData.inventory_value.total.toLocaleString()}
              </span>
              <span className="text-sm text-green-600 ml-2 flex items-center">
                <i className="fa-solid fa-arrow-trend-up mr-1"></i> 
                {inventoryData.inventory_value.categories.some(c => c.trend === 'up') ? '8.2%' : '0%'}
              </span>
            </div>
            
            <div className="space-y-3">
              {inventoryData.inventory_value.categories.length > 0 ? (
                inventoryData.inventory_value.categories.map((category, index) => (
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
                        style={{ 
                          width: `${(category.value / inventoryData.inventory_value.total) * 100}%`,
                          maxWidth: '100%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;