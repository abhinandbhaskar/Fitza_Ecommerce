import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector} from "react-redux";
import "./MyOrders.css";
import AddReturnRefund from "./MyOrderComponents/AddReturnRefund";
import ReturnRefundStatus from "./MyOrderComponents/returnrefundstatus";

const MyOrders = ({setCurrentView,myorderview,setMyOrderView}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const handleFilterClick = (filter) => setActiveFilter(filter);
  const { accessToken } = useSelector((state) => state.auth);
  const [orderinfo,setOrderInfo]=useState([]);
  const [details,setDetails]=useState("");
  const [orderId,setOrderId]=useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [address,setAddress]=useState("");

  // Filter orders based on active filter and search term
  const filteredOrders = orderinfo
    .filter((order) => {
      // Filter by active status first
      if (activeFilter !== "all" && order.order_status.status !== activeFilter) {
        return false;
      }
      
      // Then filter by search term if it exists
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const orderIdMatch = `#160${order.id}`.toLowerCase().includes(lowerSearchTerm);
        const productNameMatch = order.order_lines.some(line => 
          line.product_item.product.product_name.toLowerCase().includes(lowerSearchTerm)
        );
        return orderIdMatch || productNameMatch;
      }
      
      return true;
    });

  // ... rest of your existing code ...

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <i className="fa-solid fa-cart-shopping text-4xl text-blue-500"></i>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {myorderview==="myorder" && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4 gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by Product Name or Order ID"
              className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {["all","processing","pending", "confirmed","delivered", "cancelled"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
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
                {filteredOrders.map((order,key) => (
                  <tr key={key} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <a href={`/order/${order.id}`} className="text-blue-500 hover:underline">
                        #160{order.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 flex items-center gap-2">
                      <img
                        src={"https://127.0.0.1:8000/"+order.order_lines[0].product_item.product.items[0].images[0].main_image}
                        alt="Product"
                        className="w-10 h-10 rounded"
                      />
                      <span>Product Name {order.order_lines[0].product_item.product.product_name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      <span className="text-green-600">{order.order_status.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{order.order_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">Rs. {order.final_total}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 flex gap-2">
                      <button onClick={()=>handleViewDetails(order)} className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        View Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ... rest of your existing view conditions ... */}
    </div>
  );
};

export default MyOrders;