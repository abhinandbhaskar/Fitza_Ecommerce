import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminOrderDetails from "./OrderSectionComponents/AdminOrderDetails";
import { safe } from "../../../../utils/safeAccess";
const OrdersSection = () => {
    const [currentView, setCurrentView] = useState("pending");
    const { accessToken } = useSelector((state) => state.auth);
    const [pendingOrder, setPendingOrder] = useState([]);
    const [label, setLabel] = useState("pending");
    const [statuscounts, setStatuscounts] = useState([]);
    const [orderfilter, setOrderFilter] = useState("pending");

    const fetchPendingOrders = async () => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/admin/view_pending_orders/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Out", response);
            console.log("Out", response.data);
            setPendingOrder(response.data.orders);
            setStatuscounts(response.data.statuscounts);
        } catch (errors) {
            console.log(errors);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const handlePendingView = () => {
        setOrderFilter("pending");
        setLabel("pending");
        setCurrentView("pending");
    };

    const handleOngoingView = () => {
        setOrderFilter("processing");
        setLabel("ongoing");
        setCurrentView("pending");
    };

    const handleCompletedView = () => {
        setOrderFilter("completed");
        setLabel("completed");
        setCurrentView("pending");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Orders</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {[
                    {
                        label: "Pending Orders",
                        count: statuscounts["pending"],
                        bgColor: "bg-yellow-100",
                        textColor: "text-yellow-600",
                    },
                    {
                        label: "Ongoing Orders",
                        count: statuscounts["ongoing"],
                        bgColor: "bg-blue-100",
                        textColor: "text-blue-600",
                    },
                    {
                        label: "Completed Orders",
                        count: statuscounts["completed"],
                        bgColor: "bg-green-100",
                        textColor: "text-green-600",
                    },
                ].map((status, index) => (
                    <div key={index} className={`p-4 rounded-lg shadow-md ${status.bgColor} ${status.textColor}`}>
                        <h2 className="text-xl font-bold">{status.count}</h2>
                        <p className="text-sm md:text-lg font-medium">{status.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center space-x-6 p-6 bg-white rounded-lg shadow-sm">
                <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-sm"
                    onClick={() => handlePendingView()}
                >
                    Pending Orders
                </button>
                <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-sm"
                    onClick={() => handleOngoingView()}
                >
                    Ongoing Orders
                </button>
                <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-sm"
                    onClick={() => handleCompletedView()}
                >
                    Completed Orders
                </button>
            </div>

            {currentView === "pending" && (
                <>
                    <div className="w-full p-5">
                        {label === "pending" && <h1 className="font-bold text-md text-yellow-500">Pending Orders</h1>}
                        {label === "ongoing" && <h1 className="font-bold text-md text-blue-600">Ongoing Orders</h1>}
                        {label === "completed" && <h1 className="font-bold text-md text-green-500">Completed Orders</h1>}
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-black">
                                        <th>Order ID</th>
                                        <th>User</th>
                                        <th>Seller</th>
                                        <th>Order Status</th>
                                        <th>View Orders</th>
                                        <th>Payment Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOrder.length > 0 ? (
                                        pendingOrder
                                            .filter((items) => items?.order_status?.status === orderfilter)
                                            .map((order, index) => (
                                                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                        #ORD-{safe(order, "id")}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                        {safe(order, "user.email")}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                        {" "}
                                                        <ul>
                                                            {order.order_lines.map((value, key) => (
                                                                <li>{safe(value, "seller.email")}</li>
                                                            ))}
                                                        </ul>{" "}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                        {safe(order, "order_status.status") || "Pending"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                        <button
                                                            onClick={() =>
                                                                setCurrentView({ view: "orderdetails1", data: order })
                                                            }
                                                            className="px-2 py-1 bg-blue-600 rounded-md hover:bg-blue-700 text-white"
                                                        >
                                                            View Order
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                        {safe(order, "payment_method.status") || "Pending"}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {currentView.view === "orderdetails1" && <AdminOrderDetails currentView={currentView} />}
        </div>
    );
};

export default OrdersSection;
