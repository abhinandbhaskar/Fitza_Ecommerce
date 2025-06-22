import React, { useEffect, useState } from "react";
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
    ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import axios from "axios";
import PendingActions from "../../DashboardComponents/PendingActions/PendingActions";

const MainSection = ({ setCurrentView }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [dashboardCount, setDashboardCount] = useState({
        users: 0,
        sellers: 0,
        orders: 0,
        products: 0,
        revenue: 0,
        reviews: 0,
        sales: 0,
    });
    const [salesData, setSalesData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [topProductsData, setTopProductsData] = useState([]);

    const fetchDashBoardData = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/fetch_admin_dashboard/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setDashboardCount({
                users: response.data.data.totalusers || 0,
                sellers: response.data.data.totalsellers || 0,
                orders: response.data.data.totalorders || 0,
                products: response.data.data.totalproducts || 0,
                revenue: response.data.data.totalrevenue || 0,
                reviews: response.data.data.totalratingreview || 0,
                sales: response.data.data.total_sales || 0,
            });

            const salesByMonth = processSalesData(response.data.data.data || []);
            setSalesData(salesByMonth);

            const revenueByCategory = processRevenueData(response.data.data.data || []);
            setRevenueData(revenueByCategory);

            const topProducts = processTopProductsData(response.data.data.data || []);
            setTopProductsData(topProducts);
        } catch (errors) {
            console.log("err", errors);
        }
    };

    const processSalesData = (rawData) => {
        const monthlySales = {};

        rawData.forEach((item) => {
            const date = new Date(item.bill_date);
            const month = date.toLocaleString("default", { month: "short" });
            const amount = parseFloat(item.total_amount) || 0;

            if (!monthlySales[month]) {
                monthlySales[month] = 0;
            }
            monthlySales[month] += amount;
        });

        return Object.keys(monthlySales).map((month) => ({
            name: month,
            sales: monthlySales[month],
        }));
    };

    const processRevenueData = (rawData) => {
        const categoryRevenue = {};

        rawData.forEach((item) => {
            if (item.category_sales) {
                Object.keys(item.category_sales).forEach((category) => {
                    const quantity = item.category_sales[category] || 0;
                    const amount = parseFloat(item.total_amount) || 0;
                    const revenuePerCategory =
                        amount * (quantity / Object.values(item.category_sales).reduce((a, b) => a + b, 0));

                    if (!categoryRevenue[category]) {
                        categoryRevenue[category] = 0;
                    }
                    categoryRevenue[category] += revenuePerCategory;
                });
            }
        });

        return Object.keys(categoryRevenue).map((category) => ({
            name: category,
            value: Math.round(categoryRevenue[category]),
        }));
    };

    // Process raw data into top products for bar chart
    const processTopProductsData = (rawData) => {
        const productSales = {};

        rawData.forEach((item) => {
            if (item.category_name?.products && item.orders?.order_lines) {
                item.category_name.products.forEach((product, index) => {
                    const quantity = item.orders.order_lines[index]?.quantity || 0;

                    if (!productSales[product]) {
                        productSales[product] = 0;
                    }
                    productSales[product] += quantity;
                });
            }
        });

        return Object.keys(productSales)
            .map((product) => ({
                name: product,
                sales: productSales[product],
            }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
    };

    useEffect(() => {
        fetchDashBoardData();
    }, []);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

    return (
        <>
            {/* Header Section */}
            <div className="bg-amber-500 rounded-lg shadow-md mb-4">
                <div className="bg-white border border-gray-300 flex items-center px-6 py-3 rounded-t-lg">
                    <h1 onClick={() => setCurrentView("mainsection")} className="text-xl font-semibold text-gray-800">
                        Dashboard &gt;
                    </h1>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
                    <div className="grid grid-cols-3 gap-6 flex-grow">
                        {[
                            {
                                title: "Total Users",
                                count: dashboardCount.users,
                                icon: <i className="fas fa-users text-2xl text-blue-400"></i>,
                            },
                            {
                                title: "Total Sellers",
                                count: dashboardCount.sellers,
                                icon: <i className="fas fa-store text-2xl text-blue-400"></i>,
                            },
                            {
                                title: "Total Orders",
                                count: dashboardCount.orders,
                                icon: <i className="fas fa-shopping-bag text-2xl text-blue-400"></i>,
                            },
                            {
                                title: "Total Products",
                                count: dashboardCount.products,
                                icon: <i className="fas fa-boxes text-2xl text-blue-400"></i>,
                            },
                            {
                                title: "Total Revenue",
                                count: dashboardCount.revenue,
                                icon: <i className="fas fa-money-bill-wave text-2xl text-blue-400"></i>,
                            },
                            {
                                title: "Total Reviews",
                                count: dashboardCount.reviews,
                                icon: <i className="fas fa-star text-2xl text-blue-400"></i>,
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="h-40 bg-gray-800 flex flex-col items-start justify-between p-6 rounded-xl border-l-4 border-blue-500 hover:bg-gray-700 transition-colors duration-200"
                            >
                                <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                                    {stat.title}
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-white text-3xl font-bold">{stat.count}</div>
                                    <div className="p-3 bg-gray-700 rounded-lg">{stat.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 bg-gray-800 rounded-xl p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                                    Total Sales
                                </div>
                                <div className="text-white text-3xl font-bold mt-2">{dashboardCount.sales}</div>
                            </div>
                            <div className="p-4 bg-blue-500 bg-opacity-20 rounded-lg">
                                <i className="fas fa-chart-line text-3xl text-blue-400"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            <i className="fas fa-chart-line mr-2 text-blue-500"></i>
                            Sales Trends
                        </h2>
                    </div>
                    <div className="h-64">
                        {salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p>No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        <i className="fas fa-chart-pie mr-2 text-purple-500"></i>
                        Revenue Breakdown
                    </h2>
                    <div className="h-64">
                        {revenueData.length > 0 ? (
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
                                        formatter={(value) => [`$${value}`, "Revenue"]}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p>No revenue data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    <i className="fas fa-star mr-2 text-yellow-500"></i>
                    Top-Selling Products
                </h2>
                <div className="h-64">
                    {topProductsData.length > 0 ? (
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
                                        backgroundColor: "#fff",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                    formatter={(value) => [`${value} units`, "Sales"]}
                                />
                                <Legend />
                                <Bar dataKey="sales" fill="#10b981" name="Units Sold" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p>No product sales data available</p>
                        </div>
                    )}
                </div>
            </div>
            <PendingActions setCurrentView={setCurrentView} />
        </>
    );
};

export default MainSection;
