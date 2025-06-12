import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductsInsights = () => {
  const { accessToken } = useSelector((state) => state.auth);

  const [revenueData, setRevenueData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [categorySalesData, setCategorySalesData] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApprovals: 0,
    categories: 0,
    brands: 0
  });

  const fetchDashBoardData = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/admin/fetch_admin_dashboard/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      console.log("Resssss", response.data);
      
      // Set stats data
      setStats({
        totalProducts: response.data.data.totalproducts || 0,
        pendingApprovals: response.data.data.pending_products || 0,
        categories: response.data.data.product_categories || 0,
        brands: response.data.data.product_brands || 0
      });

      // Process category sales data
      const categorySales = processCategorySalesData(response.data.data.data || []);
      setCategorySalesData(categorySales);

      // Process top products data
      const topProducts = processTopProductsData(response.data.data.data || []);
      setTopProductsData(topProducts);
      
    } catch (errors) {
      console.log("err", errors);
    }
  }

  // Process category sales data from API
  const processCategorySalesData = (apiData) => {
    const categoryMap = {};

    apiData.forEach(order => {
      const categories = order.category_name?.categories || [];
      const sales = order.category_sales || {};

      categories.forEach(category => {
        if (sales[category]) {
          if (!categoryMap[category]) {
            categoryMap[category] = 0;
          }
          categoryMap[category] += sales[category];
        }
      });
    });

    return Object.entries(categoryMap).map(([name, sales]) => ({
      name,
      sales
    }));
  };

  // Process top products data from API
  const processTopProductsData = (apiData) => {
    const productMap = {};

    apiData.forEach(order => {
      const products = order.category_name?.products || [];
      const orderLines = order.orders?.order_lines || [];

      products.forEach((product, index) => {
        if (orderLines[index]) {
          if (!productMap[product]) {
            productMap[product] = {
              sales: 0,
              revenue: 0
            };
          }
          productMap[product].sales += orderLines[index].quantity;
          // Calculate revenue if total_amount is available
          if (order.total_amount && parseFloat(order.total_amount) > 0) {
            // Distribute revenue proportionally to products
            const totalQuantity = orderLines.reduce((sum, line) => sum + line.quantity, 0);
            const productRevenue = (parseFloat(order.total_amount) * orderLines[index].quantity) / totalQuantity;
            productMap[product].revenue += productRevenue;
          }
        }
      });
    });

    return Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: parseFloat(data.revenue.toFixed(2))
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Get top 5 products
  };

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          <span className="text-indigo-600">Products Insights</span>
        </h1>
      </div>
      
      <div className="w-full max-w-7xl mx-auto">
        {/* Product Stats */}
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h1 className="text-lg font-semibold text-gray-700">Total Products</h1>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalProducts}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h1 className="text-lg font-semibold text-gray-700">Pending Approvals</h1>
              <p className="text-2xl font-bold text-indigo-600">{stats.pendingApprovals}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h1 className="text-lg font-semibold text-gray-700">Categories</h1>
              <p className="text-2xl font-bold text-indigo-600">{stats.categories}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h1 className="text-lg font-semibold text-gray-700">Brands</h1>
              <p className="text-2xl font-bold text-indigo-600">{stats.brands}</p>
            </div>
          </div>
        </div>

        {/* Charts Container */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Category Sales Chart Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Sales by Category</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top Selling Products Chart Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Selling Products</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" name="Units Sold" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsInsights;