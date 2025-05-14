import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./MyOrders.css";
import AddReturnRefund from "./MyOrderComponents/AddReturnRefund";
import ReturnRefundStatus from "./MyOrderComponents/returnrefundstatus";

const MyOrders = ({ setCurrentView, myorderview, setMyOrderView }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [orderinfo, setOrderInfo] = useState([]);
  const [details, setDetails] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);

  // Safe data access helper
  const safeGet = (obj, path, defaultValue = "Not Available") => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  const fetchBill = async (orderId) => {
    try {
      const response = await axios.get(`https://127.0.0.1:8000/api/get_bill/${orderId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'blob',
      });
      
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${orderId}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
      setError("Failed to download invoice");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://127.0.0.1:8000/api/get_orders/", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setOrderInfo(response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    if (!order) return;
    setMyOrderView("details");
    setOrderId(order.id);
    setDetails(order);
  };

  if (loading && myorderview === "myorder") {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <i className="fa-solid fa-cart-shopping text-4xl text-blue-500"></i>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {myorderview === "myorder" && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4 gap-4">
            <input
              type="text"
              placeholder="Search by Product Name or Order ID"
              className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex flex-wrap gap-2">
              {["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`py-2 px-4 rounded-lg shadow-md font-medium ${
                    activeFilter === filter
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            {orderinfo.length === 0 ? (
              <div className="text-center py-10">No orders found</div>
            ) : (
              <table className="min-w-full table-auto bg-white shadow-lg rounded-lg border border-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderinfo.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <span className="text-blue-500">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 flex items-center gap-2">
                        {order.order_lines?.[0]?.product_item?.product?.items?.[0]?.images?.[0]?.main_image && (
                          <img
                            src={`https://127.0.0.1:8000/${order.order_lines[0].product_item.product.items[0].images[0].main_image}`}
                            alt="Product"
                            className="w-10 h-10 rounded"
                          />
                        )}
                        <span>
                          {safeGet(order, 'order_lines.0.product_item.product.product_name')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        <span className="text-green-600">
                          {safeGet(order, 'order_status.status')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {safeGet(order, 'order_date')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        Rs. {safeGet(order, 'order_total', 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
                        >
                          View
                        </button>
                        <button className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md">
                          Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {myorderview === "details" && details && (
        <>
          {/* Breadcrumb */}
          <div className="py-2 text-gray-600 text-sm">
            <button onClick={() => setMyOrderView("myorder")} className="hover:underline">
              My Orders
            </button>
            <span> &gt; </span>
            <span className="font-semibold text-blue-600">Order Details</span>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-4 my-4">
            <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
            <div className="mt-2 text-gray-600">
              <p><span className="font-semibold">Order ID:</span> {details.id}</p>
              <p><span className="font-semibold">Payment Method:</span> {safeGet(details, 'order_status.status')}</p>
              <p><span className="font-semibold">Order Date:</span> {safeGet(details, 'order_date')}</p>
              <p><span className="font-semibold">Estimated Delivery:</span> {safeGet(details, 'shipping_address.estimated_delivery_date')}</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-md p-4 my-4">
            <h2 className="text-xl font-semibold text-gray-800">Products Details</h2>
            {details.order_lines?.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 mt-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white md:flex-row flex-col gap-4 px-4"
              >
                <img
                  src={`https://127.0.0.1:8000/${safeGet(product, 'product_item.product.items.0.images.0.main_image', '')}`}
                  alt="Product"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 text-sm md:text-base">
                  <h3 className="font-semibold">{safeGet(product, 'product_item.product.product_name')}</h3>
                  <p className="text-gray-600">{safeGet(product, 'product_item.product.product_description')}</p>
                  <p><span className="font-semibold">Price:</span> Rs. {safeGet(product, 'price')}</p>
                  <p><span className="font-semibold">Quantity:</span> {safeGet(product, 'quantity')}</p>
                </div>
                <div className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl transition-colors">
                  <span className="px-8 font-bold text-2xl"> &gt; </span>
                </div>
              </div>
            ))}
          </div>

          {/* Rest of the details sections... */}

          <div className="text-right mt-4">
            <button
              onClick={() => handleDownloadInvoice(details.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Invoice
            </button>
          </div>
        </>
      )}

      {myorderview === "returnrefund" && orderId && (
        <AddReturnRefund orderId={orderId} />
      )}

      {myorderview === "returnrefundstatus" && orderId && (
        <ReturnRefundStatus orderId={orderId} />
      )}
    </div>
  );
};
export default MyOrders;
