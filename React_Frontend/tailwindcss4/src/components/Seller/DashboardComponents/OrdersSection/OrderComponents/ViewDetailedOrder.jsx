import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ViewDetailedOrder = ({ currentView }) => {
    const [orderData, setOrderData] = useState(null);
    const [orderStatus,setOrderStatus]=useState("");
    const [shippingStatus,setShippingStatus]=useState("");
    const { accessToken } = useSelector((state) => state.auth);

    const [addressType, setAddressType] = useState("shipping");

    const shippingDetails = orderData?.order?.shipping_address.shipping_address || {};
    const billingDetails = orderData?.order?.shipping_address.shipping_address || {};
    const addressDetails = addressType === "shipping" ? shippingDetails : billingDetails;

    useEffect(() => {
        if (currentView.view === "shippedorders") {
            const NewData = currentView.data;
            setOrderData(NewData);
            console.log("New data received:", NewData);
            setOrderStatus(orderData?.order?.order_status?.status);
            setShippingStatus(orderData?.order?.shipping_address?.status);

        }
    }, [currentView]);
 useEffect(() => {
        if (orderData) {
            console.log("Full orderData structure:", orderData); 
            const orderStatusFromData = orderData?.order?.order_status?.status;
            const shippingStatusFromData = orderData?.order?.shipping_address?.status;
            setOrderStatus(orderStatusFromData || "");
            setShippingStatus(shippingStatusFromData || ""); 

            console.log("Shipping Status:", shippingStatusFromData);
            console.log("Order Status:", orderStatusFromData);
        }
    }, [orderData]);

    const handleOrderShipChanges=async(sid,oid,uid)=>{

        const statusData={
            "orderStatus":orderStatus,
            "shippingStatus":shippingStatus,
            "sid":sid,
            "oid":oid,
            "uid":uid
        }
        console.log("X",statusData);

        try{
            const response=await axios.post("https://127.0.0.1:8000/api/seller/update_order_shipping/",statusData,{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type":"application/json",

                }
            });
              console.log(response.data);
        }catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }

    }



    return (
        <div className="w-full p-5">
            {/* Page Header */}
            <h1 className="font-bold text-2xl text-blue-500">New Orders</h1>

            {/* Order Header Section */}
            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Order Details</h2>
                <p className="mt-2">
                    <strong>Order ID:</strong>
                     {orderData?.order?.id || "Not Available"}
                </p>
                <p>
                    <strong>User:</strong> 
                    {orderData?.order?.user?.first_name || "Not Available"} ({orderData?.order?.user?.email || "Not Available" })
                </p>
                <p>
                    <strong>Order Date:</strong> 
                    {new Date(orderData?.order?.order_date).toLocaleString()}
                </p>
                <p>
                    <strong>Order Status:</strong> 
                    {orderData?.order?.order_status?.status||"processing"}
                </p>
            </div>

            {/* Order Summary Section */}
            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Order Summary</h2>
                <p>
                    <strong>Order Total:</strong>
                     {orderData?.product_item?.original_price*orderData?.quantity}
                    
                </p>
                <p>
                    <strong>Final Total:</strong> 
                    {orderData?.price*orderData?.quantity}
                </p>
                <p>
                    <strong>Free Shipping:</strong> 
                    {orderData?.order?.free_shipping_applied ? "Yes" : "No"}
                </p>
            </div>

            {/* Order Items Section */}
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
                       
                            <tr key="" className="border-b">
                                <td className="p-2">{orderData?.product_item?.product?.product_name || "Not Available"}</td>
                                <td className="p-2 flex flex-col"> <span>{orderData?.seller?.first_name || "N/A"}</span> <span>{orderData?.seller?.email  || "N/A"}</span></td>
                                <td className="p-2">{orderData?.quantity || "Not Available"}</td>
                                <td className="p-2">${orderData?.price || "Not Available"}</td>
                                <td className="p-2">${orderData?.price*orderData?.quantity || "Not Available"}</td>
                            </tr>
                       
                    </tbody>
                </table>
            </div>

            {/* Payment Information Section */}
            <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">Payment Information</h2>
                <p>
                    <strong>Payment Status : </strong> {orderData?.order?.payment_method?.status || "Not Available"}
                </p>
                <p>
                    <strong>Payment Date : </strong> {orderData?.order?.payment_method?.payment_date || "Not Available"}
                </p>
                <p>
                    <strong>Amount Earned : </strong> $ {orderData?.price*orderData?.quantity || "Not Available"}
                </p>
            
            </div>

            {/* Shipping Information Section */}

    <div className="mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="font-semibold text-xl">Shipping Information</h2>
        <div className="flex gap-4 mb-4">
            <button
                onClick={() => setAddressType("shipping")}
                className={`px-4 py-2 rounded-lg ${addressType === "shipping" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                Shipping Address
            </button>
            <button
                onClick={() => setAddressType("billing")}
                className={`px-4 py-2 rounded-lg ${addressType === "billing" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                Billing Address
            </button>
        </div>
        <p>
            <strong>Address Line 1:</strong> {addressDetails?.address_line1 || "Not Available"}
        </p>
        <p>
            <strong>Address Line 2:</strong> {addressDetails?.address_line2 || "Not Available"}
        </p>
        <p>
            <strong>City:</strong> {addressDetails?.city || "Not Available"}
        </p>
        <p>
            <strong>State:</strong> {addressDetails?.state || "Not Available"}
        </p>
        <p>
            <strong>Postal Code:</strong> {addressDetails?.postal_code || "Not Available"}
        </p>
        <p>
            <strong>Country:</strong> {addressDetails?.country || "Not Available"}
        </p>
        <p>
            <strong>Phone:</strong> {addressDetails?.phone || "Not Available"}
        </p>
        <p>
            <strong>Status:</strong> {orderData?.order?.shipping_address?.status || "Not Available"}
        </p>
        <p>
            <strong>Tracking ID:</strong> {orderData?.order?.shipping_address?.tracking_id || "N/A"}
        </p>
    </div>

            {/* Admin Actions Section */}
<div className="mt-5 p-6 rounded-lg shadow-lg max-w-2xl bg-white">
    <h2 className="font-semibold text-2xl mb-4 text-gray-800">Seller Actions</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Status Dropdown */}
        <div>
            <label htmlFor="orderStatus" className="block font-medium text-gray-700 mb-2">Order Status</label>
            <select onChange={(e)=>setOrderStatus(e.target.value)}
                id="orderStatus" 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="processing">Select Order Status</option> {/* Default placeholder */}
                <option value="confirm">Confirm</option>
                <option value="ready-for-dispatch">Ready for Dispatch</option>
                <option value="cancelled">Cancelled</option>
                <option value="delivered">Delivered</option>
            </select>
        </div>
        
        {/* Shipping Status Dropdown */}
        <div>
            <label htmlFor="shippingStatus" className="block font-medium text-gray-700 mb-2">Shipping Status</label>
            <select 
                onChange={(e)=>setShippingStatus(e.target.value)}
                id="shippingStatus" 
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="pending">Select Shipping Status</option> {/* Default placeholder */}
                <option value="not-shipped">Not Shipped</option>
                <option value="shipped">Shipped</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed-delivery">Failed Delivery</option>
            </select>
        </div>
    </div>
    
    {/* Submit Changes Button */}
    <div className="mt-6">
        <button 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            onClick={() =>handleOrderShipChanges(orderData?.order?.shipping_address?.id,orderData?.order?.id,orderData?.order?.user?.id)}
        >
            Submit Changes
        </button>
    </div>
</div>
        </div>
    );
};

export default ViewDetailedOrder;
