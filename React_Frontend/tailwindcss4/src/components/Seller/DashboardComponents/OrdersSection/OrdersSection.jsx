import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ViewDetailedOrder from "./OrderComponents/ViewDetailedOrder";
import {safe} from "../../../../utils/safeAccess";

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
            setFilteredOrders(response.data.orders);
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

<div className="p-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
    {[
        { title: "New Orders", count: statuscount.processing, color: "border-blue-500 text-blue-600" },
        { title: "Confirmed", count: statuscount.confirm, color: "border-green-500 text-green-600" },
        { title: "Shipped", count: statuscount.readyfordispatch, color: "border-orange-500 text-orange-600" },
        { title: "Delivered", count: statuscount.delivered, color: "border-teal-500 text-teal-600" },
        { title: "Cancelled", count: statuscount.cancelled, color: "border-red-500 text-red-600" },
    ].map((card, index) => (
        <div 
            key={index} 
            className="rounded-lg border border-gray-300 shadow-md p-4 bg-white hover:shadow-md transition-all"
        >
            <h3 className={`text-sm font-medium uppercase tracking-wider border-l-4 pl-2 ${card.color}`}>
                {card.title}
            </h3>
            <p className={`text-2xl font-semibold mt-3 ${card.color.split(' ')[1]}`}>
                {card.count}
            </p>
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
    {/* Order Status Select Box - Professional */}
    <select
        onChange={(e) => setOrderstatus(e.target.value)}
        className="w-full md:w-64 bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm transition-all"
    >
        <option value="all">All Orders</option>
        <option value="processing">New Orders</option>
        <option value="confirm">Confirmed Orders</option>
        <option value="ready-for-dispatch">Shipped Orders</option>
        <option value="delivered">Delivered Orders</option>
        <option value="cancelled">Cancelled Orders</option>
    </select>
</div>
                </div>
            </div>

           {
            currentView !== "neworders" && (
                 <div className="mt-4 bg-blue-50 p-4 px-6 rounded-lg shadow-sm flex items-center gap-4">
                <p className="text-gray-600 flex items-center text-base md:text-lg">
                    <span onClick={()=>setCurrentView("neworders")} className="text-gray-500 text-sm font-medium mr-2">&lt;Back </span>
                </p>
            </div>
            )
           }

            {currentView === "neworders" && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Order Date</th>
                                <th>Status</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders
                                .filter((item) => orderstatus === "all" ? item : item.order.order_status.status === orderstatus)
                                .map((item, index) => (
                                    <tr key={index}  className="hover:bg-gray-100 transition duration-200">
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">ORD-{safe(item,'order.id')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(item,'order.user.first_name')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                             {safe(item, "order.order_date") ? new Date(safe(item, "order.order_date")).toLocaleString() : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                {safe(item,'order.order_status.status')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">Rs.{safe(item,'price') * safe(item,'quantity')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300 text-center">
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