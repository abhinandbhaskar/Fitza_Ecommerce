import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const PendingActions = ({ setCurrentView }) => {
    const { accessToken } = useSelector((state) => state.auth);

    const [sellerApprovals, setSellerApproval] = useState(0);
    const [productApprovals, setProductApproval] = useState(0);
    const [reviewApprovals, setReviewApproval] = useState(0);
    const [complaints, setComplaints] = useState(0);
    const [refunds, setRefunds] = useState(0);
    const [topSellersData, setTopSellersData] = useState([]);

    const fetchPendingActions = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/admin_pendings_actions/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            console.log("Datass", response.data);
            setSellerApproval(response.data.sellerscount);
            setProductApproval(response.data.productscount);
            setReviewApproval(response.data.reviewratings);
            setComplaints(response.data.complaints);
            setRefunds(response.data.returnrefund);
            
            // Transform the top sellers data to match the chart format
            if (response.data.topsellers && response.data.topsellers.length > 0) {
                const transformedData = response.data.topsellers.map(seller => ({
                    name: seller.shop_name,
                    sales: seller.total_orders,
                    revenue: parseFloat(seller.total_revenue)
                }));
                setTopSellersData(transformedData);
            }
        } catch (errors) {
            console.log("err", errors);
        }
    }

    useEffect(() => {
        fetchPendingActions();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Sellers Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    <i className="fas fa-trophy mr-2 text-yellow-500"></i>
                    Top Performing Sellers
                </h2>
                <div className="h-64">
                    {topSellersData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topSellersData}
                                layout="horizontal"
                                margin={{ top: 15, right: 30, left: 20, bottom: 15 }}
                            >
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis
                                    dataKey="sales"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280' }}
                                    label={{ value: 'Number of Sales', position: 'insideBottomRight', offset: -5 }}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280' }}
                                    width={120}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255, 255, 255, 0.96)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                    formatter={(value, name, props) => [
                                        <span className="font-semibold" key="value">{value} sales</span>,
                                        <span className="text-gray-500" key="name">${props.payload.revenue?.toLocaleString() || 0} revenue</span>
                                    ]}
                                    labelStyle={{ fontWeight: 'bold', color: '#4b5563' }}
                                />
                                <Bar
                                    dataKey="sales"
                                    fill="url(#colorSales)"
                                    name="Sales Count"
                                    radius={[4, 4, 4, 4]}
                                    animationDuration={1500}
                                >
                                    {topSellersData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#colorSales)`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <i className="fas fa-users text-4xl mb-2 text-gray-300"></i>
                            <p>No seller data available</p>
                            <p className="text-sm mt-1">Seller performance will appear here</p>
                        </div>
                    )}
                </div>
                {topSellersData.length > 0 && (
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                        <span>Top seller: {topSellersData[0]?.name}</span>
                        <span className="font-medium text-blue-600">
                            {topSellersData[0]?.sales} sales (${topSellersData[0]?.revenue?.toLocaleString() || 0})
                        </span>
                    </div>
                )}
            </div>

            {/* Pending Actions Panel */}
            {/* ... rest of your existing Pending Actions Panel code remains the same ... */}

                        {/* Pending Actions Panel */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Pending Actions</h2>
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
                        <div className="flex-1" onClick={() => setCurrentView("sellers")}>
                            <h3 className="font-medium text-gray-800">Pending Approvals</h3>
                            <p className="text-sm text-gray-500">
                                {sellerApprovals} new seller applications waiting for review
                            </p>
                        </div>
                        <button className="text-sm text-blue-500">View</button>
                    </div>

                    {/* Product Approvals */}
                    <div className="p-4 hover:bg-gray-50 flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                            <i className="fas fa-box text-green-500"></i>
                        </div>
                        <div className="flex-1" onClick={() => setCurrentView("products")}>
                            <h3 className="font-medium text-gray-800">Product Approvals</h3>
                            <p className="text-sm text-gray-500">
                                {productApprovals} products awaiting admin approval
                            </p>
                        </div>
                        <button className="text-sm text-blue-500">View</button>
                    </div>

                    {/* Review Approvals */}
                    <div className="p-4 hover:bg-gray-50 flex items-start">
                        <div className="bg-orange-100 p-2 rounded-full mr-3">
                            <i className="fas fa-star text-orange-500"></i>
                        </div>
                        <div className="flex-1" onClick={() => setCurrentView("reviews")}>
                            <h3 className="font-medium text-gray-800">Review Approvals</h3>
                            <p className="text-sm text-gray-500">
                                {reviewApprovals} product reviews pending moderation
                            </p>
                        </div>
                        <button className="text-sm text-blue-500">View</button>
                    </div>

                    {/* Flagged Issues */}
                    <div className="p-4 hover:bg-gray-50 flex items-start">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                            <i className="fas fa-flag text-red-500"></i>
                        </div>
                        <div className="flex-1" onClick={() => setCurrentView("complaints")}>
                            <h3 className="font-medium text-gray-800">Flagged Issues</h3>
                            <p className="text-sm text-gray-500">
                                {complaints} Complaints reported by sellers
                            </p>
                        </div>
                        <button className="text-sm text-blue-500">View</button>
                    </div>

                    {/* Refund Alerts */}
                    <div className="p-4 hover:bg-gray-50 flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <i className="fas fa-exchange-alt text-purple-500"></i>
                        </div>
                        <div className="flex-1" onClick={() => setCurrentView("sellers")}>
                            <h3 className="font-medium text-gray-800">Refund Alerts</h3>
                            <p className="text-sm text-gray-500">
                                {refunds} refund requests pending processing
                            </p>
                        </div>
                        <button className="text-sm text-blue-500">View</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingActions;