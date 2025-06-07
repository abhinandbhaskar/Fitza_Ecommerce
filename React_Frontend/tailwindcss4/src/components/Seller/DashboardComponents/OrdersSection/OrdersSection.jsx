import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ViewDetailedOrder from "./OrderComponents/ViewDetailedOrder";

const OrdersSection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentView, setCurrentView] = useState("neworders");
    const [orderstatus, setOrderstatus] = useState("all");
    const [statuscount, setStatusCount] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/seller/seller_view_orders/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("EEE", response.data);
            setOrders(response.data.orders);
            setFilteredOrders(response.data.orders); // Initialize filtered orders with all orders
            setStatusCount(response.data.counts);
        } catch (errors) {
            console.log(errors);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => {
                const orderId = `ORD-${order.order.id}`;
                const customerName = order.order.user.first_name.toLowerCase();
                const searchTerm = query.toLowerCase();
                
                return (
                    orderId.toLowerCase().includes(searchTerm) ||
                    customerName.includes(searchTerm)
                );
            });
            setFilteredOrders(filtered);
        }
    };

    const handleFilter = () => {
        console.log("RES", orderstatus);
        // No need for separate filter function since we're handling it in the render
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Orders</span>
                </h1>
            </div>

            {/* Overview Cards */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {[
                    { title: "New Orders", count: statuscount.processing, color: "bg-blue-500" },
                    { title: "Confirm Orders", count: statuscount.confirm, color: "bg-green-400" },
                    { title: "Shipped Orders", count: statuscount.readyfordispatch, color: "bg-orange-500" },
                    { title: "Delivered Orders", count: statuscount.delivered, color: "bg-green-600" },
                    { title: "Cancelled Orders", count: statuscount.cancelled, color: "bg-red-500" },
                ].map((card, index) => (
                    <div key={index} className={`rounded-lg shadow-md p-4 ${card.color} text-white`}>
                        <h3 className="text-lg font-medium">{card.title}</h3>
                        <p className="text-2xl font-bold">{card.count}</p>
                    </div>
                ))}
            </div>

            {/* Filters and Actions */}
            <div className="p-6 bg-white shadow-md rounded-lg mb-6">
                <div className="flex flex-row gap-4 items-center">
                    <input 
                        type="text" 
                        placeholder="Search Orders (by ID or Customer Name)" 
                        className="flex-grow p-2 border rounded-md shadow-sm"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div className="w-full flex flex-col md:flex-row items-center gap-4">
                        {/* Order Status Select Box */}
                        <select
                            onChange={(e) => setOrderstatus(e.target.value)}
                            className="w-full md:w-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        >
                            <option value="all" className="bg-blue-500 text-white">
                                All Orders
                            </option>
                            <option value="processing" className="bg-blue-500 text-white">
                                New Orders
                            </option>
                            <option value="confirm" className="bg-green-400 text-white">
                                Confirm Orders
                            </option>
                            <option value="ready-for-dispatch" className="bg-orange-500 text-white">
                                Shipped Orders
                            </option>
                            <option value="delivered" className="bg-green-600 text-white">
                                Delivered Orders
                            </option>
                            <option value="cancelled" className="bg-red-500 text-white">
                                Cancelled Orders
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {currentView === "neworders" && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <table className="w-full text-left table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-4 border">Order ID</th>
                                <th className="p-4 border">Customer Name</th>
                                <th className="p-4 border">Order Date</th>
                                <th className="p-4 border">Status</th>
                                <th className="p-4 border">Amount</th>
                                <th className="p-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders
                                .filter((item) => orderstatus === "all" ? item : item.order.order_status.status === orderstatus)
                                .map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-4 border">ORD-{item.order.id}</td>
                                        <td className="p-4 border">{item.order.user.first_name}</td>
                                        <td className="p-4 border">{item.order.order_date}</td>
                                        <td className="p-4 border">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                {item.order.order_status.status}
                                            </span>
                                        </td>
                                        <td className="p-4 border">${item.price * item.quantity}</td>
                                        <td className="p-4 border">
                                            <button
                                                onClick={() => setCurrentView({ view: "shippedorders", data: item })}
                                                className="px-2 py-1 bg-blue-600 rounded-md hover:bg-blue-700 text-white"
                                            >
                                                View Order
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {currentView.view === "shippedorders" && <ViewDetailedOrder currentView={currentView} />}
        </div>
    );
};

export default OrdersSection;