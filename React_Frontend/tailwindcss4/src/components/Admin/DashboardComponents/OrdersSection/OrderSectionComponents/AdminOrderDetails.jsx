import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { safe } from "../../../../../utils/safeAccess";
const AdminOrderDetails = ({ currentView }) => {
    const [orderData, setOrderData] = useState(null);
    const { accessToken } = useSelector((state) => state.auth);
    const AssignToSeller = async (oid, uid) => {
        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/update_order_status/${oid}/${uid}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response);
            console.log(response.data);
            alert(response.data.message);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const VerifyPayment = async (pid, sid) => {
        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/verify_payment/${pid}/${sid}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response);
            console.log(response.data);
            alert(response.data.message);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        if (currentView.view === "orderdetails1") {
            const NewData = currentView.data;
            setOrderData(NewData);
            console.log("New data received:", NewData);
        }
    }, [currentView]);

    useEffect(() => {
        if (orderData) {
            console.log("Updated orderData:", orderData);
        }
    }, [orderData]);

    return (
        <div className="w-full p-5">
            <h1 className="font-bold text-2xl text-yellow-500">Pending Orders</h1>

            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Order Details</h2>
                <p className="mt-2">
                    <strong>Order ID: </strong>
                    #ORD-{safe(orderData, "id")}
                </p>
                <p>
                    <strong>User: </strong>
                    {safe(orderData, "user.first_name")} ({safe(orderData, "user.email")})
                </p>
                <p>
                    <strong>Order Date: </strong>
                    {new Date(safe(orderData, "order_date")).toLocaleString()}
                </p>
                <p>
                    <strong>Order Status:</strong>
                    {safe(orderData, "order_status.status")}
                </p>
            </div>

            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Order Summary</h2>
                <p>
                    <strong>Order Total:</strong>
                    Rs.{safe(orderData, "order_total")}
                </p>
                <p>
                    <strong>Discount Applied:</strong>
                    Rs.{safe(orderData, "discount_amount")}
                </p>
                <p>
                    <strong>Coupon Code: </strong>
                    {safe(orderData, "applied_coupon.code") || "Not Applied.."}
                </p>
                <p>
                    <strong>Final Total:</strong>
                    Rs.{safe(orderData, "final_total")}
                </p>
                <p>
                    <strong>Free Shipping:</strong>
                    {safe(orderData, "free_shipping_applied") ? "Yes" : "No"}
                </p>
            </div>

            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Ordered Items</h2>
                <table className="w-full mt-3 text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Product Name</th>
                            <th className="p-2">Seller</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2">Price Per Item</th>
                            <th className="p-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData?.order_lines.map((item, key) => (
                            <tr key="" className="border-b">
                                <td className="p-2">{safe(item, "product_item.product.product_name")}</td>
                                <td className="p-2">{safe(item, "seller.first_name")}</td>
                                <td className="p-2">{safe(item, "quantity")}</td>
                                <td className="p-2">{safe(item, "price")}</td>
                                <td className="p-2">Rs.{item.quantity * item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Payment Information</h2>
                <p>
                    <strong>Payment Method:</strong> {orderData?.payment_method?.payment_method || "pending"}
                </p>
                <p>
                    <strong>Transaction ID:</strong> {orderData?.payment_method?.transaction_id || "pending"}
                </p>
                <p>
                    <strong>Status:</strong> {orderData?.payment_method?.status || "pending"}
                </p>
                <p>
                    <strong>Amount Paid:</strong> Rs.{orderData?.payment_method?.amount || "0.00"}
                </p>
                <p>
                    <strong>Platform Fee:</strong> Rs.{orderData?.payment_method?.platform_fee || "pending"}
                </p>
            </div>

            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Admin Actions</h2>

                <button
                    onClick={() => AssignToSeller(orderData?.id, orderData?.user?.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                    Assign Order to Seller
                </button>

                {orderData?.payment_method?.id ? (
                    <div className="inline-block mr-2">
                        <div>
                            <button
                                onClick={() => VerifyPayment(orderData?.payment_method?.id, orderData?.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg dropdown-trigger"
                            >
                                Verify Payment Status
                            </button>
                            <div className="dropdown-menu hidden mt-2 bg-white border rounded shadow-md">
                                <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Verified</button>
                                <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Failed</button>
                                <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Refunded</button>
                                <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                                    Payment Pending
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div> </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrderDetails;
