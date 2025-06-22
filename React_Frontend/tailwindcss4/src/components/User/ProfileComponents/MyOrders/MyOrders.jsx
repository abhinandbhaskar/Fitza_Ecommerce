import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./MyOrders.css";
import AddReturnRefund from "./MyOrderComponents/AddReturnRefund";
import ReturnRefundStatus from "./MyOrderComponents/returnrefundstatus";
import orderedImg from "../../../../assets/img/ordered.jpg";
import shippedImg from "../../../../assets/img/shipped.jpg";
import outfordeliveryImg from "../../../../assets/img/outfordelivery.jpg";
import deliveredImg from "../../../../assets/img/delivered.jpg";
import { safe } from "../../../../utils/safeAccess";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const MyOrders = ({ setCurrentView, myorderview, setMyOrderView }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const handleFilterClick = (filter) => setActiveFilter(filter);
  const { accessToken } = useSelector((state) => state.auth);
  const [orderinfo, setOrderInfo] = useState([]);
  const [details, setDetails] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [shipstatusImg, setShipStatusImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnbtn,setReturnbtn]=useState(false);

  const filteredOrders = orderinfo.filter((order) => {
    if (activeFilter !== "all" && order.order_status.status !== activeFilter) {
      return false;
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const orderIdMatch = `#160${order.id}`.toLowerCase().includes(lowerSearchTerm);
      const productNameMatch = order.order_lines.some((line) => {
        const productName = line?.product_item?.product?.product_name?.toLowerCase() || "";
        return productName.includes(lowerSearchTerm);
      });
      return orderIdMatch || productNameMatch;
    }

    return true;
  });

  const handleOrderCancellation = async () => {
    if (!cancellationReason) {
      alert("Please provide a cancellation reason.");
      return;
    }

    const canceldata = {
      cancellationReason: cancellationReason,
    };

    try {
      const response = await axios.post(
        `https://127.0.0.1:8000/api/user_cancel_order/${orderId}/`,
        canceldata,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // alert("Order cancellation request submitted successfully!");
      toast.success("Order cancellation request submitted successfully!");
      fetchOrders(); // Refresh orders after cancellation
    } catch (errors) {
      console.error(errors);
      // alert("Failed to cancel order. Please try again.");
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  const safeGet = (obj, path, defaultValue = "Not Available") => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  const fetchBill = async (orderId) => {
    console.log("ORDERRRRRRRRRIDDDDDDDDDDDDDDDDDDDDDDD",orderId);
    try {
      const response = await axios.get(`https://127.0.0.1:8000/api/get_bill/${orderId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${orderId}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  const handleDownloadInvoice = (oid) => {
    fetchBill(oid);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://127.0.0.1:8000/api/get_orders/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrderInfo(data);
        console.log("ORDERSIN",data);
        
      } else {
        setError("Failed to fetch orders. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("An error occurred while fetching your orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setMyOrderView("details");
    setOrderId(safe(order, "id"));
    setDetails(order);
    setAddress(safe(order, "shipping_address.shipping_address"));
    ShippingProgress(safe(order, "shipping_address.status"));
    console.log("PP",safe(order, "returns").length)
    if(safe(order, "returns").length>0)
    {
      setReturnbtn(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateEstimatedDate = (orderDateString, daysToAdd = 5) => {
    if (!orderDateString) return "Not Available";
    const orderDate = new Date(orderDateString);
    orderDate.setDate(orderDate.getDate() + daysToAdd);
    return formatDate(orderDate);
  };

  const ShippingProgress = (status) => {
    if (status === "pending") {
      setShipStatusImg(orderedImg);
    } else if (status === "shipped") {
      setShipStatusImg(shippedImg);
    } else if (status === "out-for-delivery") {
      setShipStatusImg(outfordeliveryImg);
    } else if (status === "delivered") {
      setShipStatusImg(deliveredImg);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <i className="fa-solid fa-cart-shopping text-3xl md:text-4xl text-blue-500"></i>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {myorderview === "myorder" && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4 gap-4">
            <input
              type="text"
              placeholder="Search by Product Name or Order ID"
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {["all", "processing", "pending", "confirmed", "delivered", "cancelled"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`py-2 px-4 rounded-lg shadow-md font-medium capitalize transition-colors ${
                    activeFilter === filter
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
              <button
                onClick={fetchOrders}
                className="absolute top-0 right-0 px-2 py-1 text-red-700 hover:text-red-900"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <i className="fas fa-box-open text-5xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700">No orders found</h3>
              <p className="text-gray-500 mt-2">
                {activeFilter === "all"
                  ? "You haven't placed any orders yet."
                  : `You don't have any ${activeFilter} orders.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order, key) => (
                    <tr key={key} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        #ORD-{safe(order, "id")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={
                              "https://127.0.0.1:8000/" +
                              order.order_lines[0].product_item.product.items[0].images[0].main_image
                            }
                            alt="Product"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.order_lines[0].product_item.product.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[safe(order, "order_status.status")] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {safe(order, "order_status.status")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {safe(order, "order_date")
                          ? new Date(safe(order, "order_date")).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        Rs. {safe(order, "final_total")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {myorderview === "details" && details && (
        <>
          {/* Breadcrumb */}
          <div className="py-2 text-gray-600 text-sm">
            <button
              onClick={()=>setMyOrderView("myorder")}
              className="text-blue-500 hover:text-blue-700 hover:underline"
            >
              My Orders <span> &gt; </span>
            </button>
            
            <span className="font-semibold text-blue-600">Order Details</span>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[safe(details, "order_status.status")] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {safeGet(details, "order_status.status")}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Order Number</p>
                    <p className="font-medium">#ORD-{safe(details, "id")}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">{formatDate(safeGet(details, "order_date"))}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">{safeGet(details, "payment_method.payment_method")}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-bold text-green-600">Rs. {safeGet(details, "final_total")}</p>
                  </div>
                </div>
              </div>

              {/* Products Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Products</h2>
                  <div className="space-y-4">
                    {details.order_lines.map((product, key) => (
                      <div
                        key={key}
                        className="flex items-center p-3 border border-gray-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setCurrentView({ view: "productdetail", data: product });
                        }}
                      >
                        <img
                          src={
                            "https://127.0.0.1:8000/" +
                              product.product_item.product.items[0].images[0].main_image || "Not Available.."
                          }
                          alt="Product"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {safe(product, "product_item.product.product_name") || "Not Available.."}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quantity: {safe(product, "quantity")} × Rs.{safe(product, "price")}
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            Total: Rs.{safe(product, "price") * safe(product, "quantity")}
                          </p>
                        </div>
                        <div className="text-gray-400 hover:text-gray-600">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping Status Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Status</h2>
                  <div className="flex justify-center">
                    <img
                      src={shipstatusImg}
                      className="h-auto w-full max-w-2xl"
                      alt="Shipping status"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Shipping Address Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                <div className="space-y-2">
                  <p className="font-medium">
                    {safe(address, "user.first_name")} {safe(address, "user.last_name")}
                  </p>
                  <p className="text-gray-600">
                    {safe(address, "address_line1")}, {safe(address, "address_line2")}
                  </p>
                  <p className="text-gray-600">
                    {safe(address, "city")}, {safe(address, "state")} - {safe(address, "postal_code")}
                  </p>
                  <p className="text-gray-600">{safe(address, "country")}</p>
                  <p className="text-gray-600">Phone: {safe(address, "phone") || "Not Available"}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-medium">Delivery Updates</p>
                  <p className="text-gray-600 capitalize">
                    {safe(details, "shipping_address.status") || "Not Available"}
                  </p>
                  <p className="mt-2 font-medium">Estimated Delivery</p>
                  <p className="text-gray-600">
                    {safe(address, "estimated_delivery_date")
                      ? formatDate(safe(address, "estimated_delivery_date"))
                      : calculateEstimatedDate(safe(details, "order_date"))}
                  </p>
                </div>
              </div>

              {/* Payment Details Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rs. {safeGet(details, "order_total")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-500">- Rs. {safeGet(details, "discount_amount")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {safe(details, "shipping_address.shipping_cost") == 0
                        ? "Free"
                        : `Rs. ${safe(details, "shipping_address.shipping_cost")}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>Rs. {safe(details, "payment_method.platform_fee")}</span>
                  </div>
                  {safe(details, "applied_coupon.discount_type") && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="text-green-500">
                        {safe(details, "applied_coupon.discount_type") === "fixed"
                          ? `- Rs. ${safe(details, "applied_coupon.discount_value")}`
                          : `${safe(details, "applied_coupon.discount_value")}%`}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Paid</span>
                      <span className="text-green-600">
                        Rs. {safeGet(details, "payment_method.amount")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleDownloadInvoice(details.id)}
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-file-invoice"></i>
                    Download Invoice
                  </button>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Actions</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Return & Refund</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setMyOrderView("returnrefund")}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        Initiate Return
                      </button>
                      {
                        returnbtn===true && (
                           <button
                        onClick={() => setMyOrderView("returnrefundstatus")}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        Return Status
                      </button>
                        )
                      }
                     
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Cancel Order</h3>
                    <textarea
                      placeholder="Reason for cancellation..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows="3"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    ></textarea>
                    <button
                      onClick={handleOrderCancellation}
                      className="mt-2 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-sm transition-colors"
                      disabled={!cancellationReason}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {myorderview === "returnrefund" && <AddReturnRefund setCurrentView={setCurrentView} setMyOrderView={setMyOrderView} orderId={orderId} />}

      {myorderview === "returnrefundstatus" && <ReturnRefundStatus setCurrentView={setCurrentView} setMyOrderView={setMyOrderView} orderId={orderId} />}
        <ToastContainer /> 
    </div>
  );
};

export default MyOrders;