import React, { useEffect, useState } from "react";
import profile from "../../../../assets/profile.jpg";
import OrderOverview from "../OrderOverview/OrderOverview";
import InventoryManagement from "../InventoryManagement/InventoryManagement";
import { safe } from "../../../../utils/safeAccess";
import { useSelector } from "react-redux";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const MainSection = ({ setCurrentView }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [users, setUsers] = useState(0);
    const [products, setProducts] = useState(0);
    const [orders, setOrders] = useState(0);
    const [sales, setSales] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [reviews, setReviews] = useState(0);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashBoardData = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/fetch_seller_dashboard/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log("API Response:", response.data);

            setUsers(response.data.data.totalusers);
            setProducts(response.data.data.totalproducts);
            setOrders(response.data.data.totalorders);
            setSales(response.data.data.total_sales);
            setEarnings(response.data.data.totalearnings);
            setReviews(response.data.data.totalreviews);

           
            if (response.data.data.data) {
                setSalesData(response.data.data.data);
            }

            setLoading(false);
        } catch (errors) {
            console.log("Error fetching data:", errors);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashBoardData();
    }, []);

    const processDailyData = () => {
        if (!salesData.length) return { labels: [], datasets: [] };

        const dailySales = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

        salesData.forEach((sale) => {
            const date = new Date(sale.bill_date);
            const day = date.getDay();
            const amount = parseFloat(sale.total_amount) || 0;
            dailySales[day] += amount;
        });

     
        const rotatedDailySales = [...dailySales.slice(1), dailySales[0]];

        return {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Daily Sales",
                    data: rotatedDailySales,
                    borderColor: "rgba(79, 70, 229, 1)",
                    backgroundColor: "rgba(79, 70, 229, 0.1)",
                    tension: 0.3,
                    fill: true,
                },
            ],
        };
    };

   
    const processWeeklyTrendData = () => {
        if (!salesData.length) return { labels: [], datasets: [] };

      
        const weeklySales = [0, 0, 0, 0, 0, 0]; 

    
        salesData.forEach((sale, index) => {
            const weekIndex = Math.min(Math.floor(index / (salesData.length / 6)), 5);
            const amount = parseFloat(sale.total_amount) || 0;
            weeklySales[weekIndex] += amount;
        });

        return {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [
                {
                    label: "Sales Trend (Last 6 Weeks)",
                    data: weeklySales,
                    borderColor: "rgba(16, 185, 129, 1)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    tension: 0.4,
                },
            ],
        };
    };

  
    const processTopProducts = () => {
        if (!salesData.length) return [];

        const productSales = {};

        salesData.forEach((sale) => {
            if (sale.category_name && sale.category_name.products) {
                sale.category_name.products.forEach((product) => {
                    const quantity = sale.orders?.order_lines?.reduce((sum, line) => sum + line.quantity, 0) || 0;
                    productSales[product] = (productSales[product] || 0) + quantity;
                });
            }
        });

      
        return Object.entries(productSales)
            .map(([name, sales]) => ({
                name,
                sales,
                revenue: `$${(sales * 25).toLocaleString()}`, // Assuming average price of $25
            }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5); // Top 5 products
    };

    const dailyChartData = processDailyData();
    const weeklyTrendData = processWeeklyTrendData();
    const topProducts = processTopProducts();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <>
            {/* Header Section */}
            <div className="bg-amber-50 rounded-lg shadow-md mb-4 overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 flex items-center px-4 py-3 md:px-6 md:py-4">
                    <h1 className="text-lg md:text-xl font-semibold text-gray-800">Dashboard &gt;</h1>
                </div>

                {/* Stats Section */}
                <div className="bg-gray-50 p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                title: "Total Users",
                                count: users,
                                bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
                                icon: (
                                    <svg
                                        className="w-8 h-8 text-white opacity-90"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Total Products",
                                count: products,
                                bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
                                icon: (
                                    <svg
                                        className="w-8 h-8 text-white opacity-90"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Total Orders",
                                count: orders,
                                bgColor: "bg-gradient-to-br from-violet-500 to-indigo-600",
                                icon: (
                                    <svg
                                        className="w-8 h-8 text-white opacity-90"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Total Sales",
                                count: sales,
                                bgColor: "bg-gradient-to-br from-blue-500 to-sky-600",
                                icon: (
                                    <svg
                                        className="w-8 h-8 text-white opacity-90"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Total Earnings",
                                count: earnings,
                                bgColor: "bg-gradient-to-br from-amber-500 to-yellow-600",
                                icon: (
                                    <svg
                                        className="w-8 h-8 text-white opacity-90"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Total Reviews",
                                count: reviews,
                                bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
                                icon: (
                                    <svg
                                        className="w-8 h-8 text-white opacity-90"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                        />
                                    </svg>
                                ),
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`h-40 flex flex-col justify-between p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${stat.bgColor} hover:shadow-lg hover:-translate-y-1`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white text-opacity-90 text-sm font-medium uppercase tracking-wider">
                                            {stat.title}
                                        </p>
                                        <h3 className="text-white text-3xl font-bold mt-1">{stat.count}</h3>
                                    </div>
                                    <div className="p-2 rounded-lg bg-opacity-20 backdrop-blur-sm">{stat.icon}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center text-white text-opacity-80 text-xs font-medium">
                                        <span className="animate-pulse w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
                                        Live updating
                                    </span>

                                    <span className="text-white text-opacity-80 text-xs font-medium">Real-time data</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white mb-4 border border-gray-200  rounded-xl shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Performance Metrics</h2>
                    <div className="flex space-x-2"></div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Time Period Sales */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4">
                            <h3 className="text-md font-medium text-gray-700 mb-3">Sales Overview</h3>
                            <div className="h-64">
                                {dailyChartData.datasets.length > 0 ? (
                                    <Line
                                        data={dailyChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "top",
                                                },
                                                tooltip: {
                                                    mode: "index",
                                                    intersect: false,
                                                    callbacks: {
                                                        label: function (context) {
                                                            return `$${context.parsed.y.toLocaleString()}`;
                                                        },
                                                    },
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        drawBorder: false,
                                                    },
                                                    ticks: {
                                                        callback: function (value) {
                                                            return "$" + value.toLocaleString();
                                                        },
                                                    },
                                                },
                                                x: {
                                                    grid: {
                                                        display: false,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No sales data available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sales Trend */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4">
                            <h3 className="text-md font-medium text-gray-700 mb-3">Sales Trend (Last 6 Weeks)</h3>
                            <div className="h-64">
                                {weeklyTrendData.datasets.length > 0 ? (
                                    <Line
                                        data={weeklyTrendData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "top",
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function (context) {
                                                            return `$${context.parsed.y.toLocaleString()}`;
                                                        },
                                                    },
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: false,
                                                    grid: {
                                                        drawBorder: false,
                                                    },
                                                    ticks: {
                                                        callback: function (value) {
                                                            return "$" + value.toLocaleString();
                                                        },
                                                    },
                                                },
                                                x: {
                                                    grid: {
                                                        display: false,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No trend data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4 h-full">
                        <h3 className="text-md font-medium text-gray-700 mb-3">Top Selling Products</h3>
                        <div className="space-y-4">
                            {topProducts.length > 0 ? (
                                topProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <span className="text-lg font-medium text-gray-500 mr-3 mt-1">{index + 1}</span>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-800">{product.name}</h4>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">{product.sales} sales</span>
                                                <span className="text-xs font-medium text-green-600">
                                                    {product.revenue}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                <div
                                                    className="bg-indigo-600 h-1.5 rounded-full"
                                                    style={{
                                                        width: `${
                                                            topProducts.length > 0
                                                                ? (product.sales / topProducts[0].sales) * 100
                                                                : 0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">No product sales data available</div>
                            )}
                        </div>
                        <button
                            onClick={() => setCurrentView("products")}
                            className="w-full mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                            View All Products →
                        </button>
                    </div>
                </div>
            </div>

            <OrderOverview setCurrentView={setCurrentView} />
            <InventoryManagement />
        </>
    );
};

export default MainSection;
