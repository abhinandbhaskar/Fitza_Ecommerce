import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminOrderDetails from "./OrderSectionComponents/AdminOrderDetails";
const OrdersSection = () => {
    const [currentView, setCurrentView] = useState("pending");
    const { accessToken } = useSelector((state) => state.auth);
    const [pendingOrder,setPendingOrder]=useState([]);
    const [label,setLabel]=useState("pending");
    const [statuscounts,setStatuscounts]=useState([]);



    const fetchPendingOrders=async(status)=>{
        console.log("STA",status);

      try{
        const response=await axios.get(`https://127.0.0.1:8000/api/admin/view_pending_orders/${status}/`,{
          headers:{
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":'application/json',
          }
        });
          console.log("Out",response);
          console.log("Out",response.data);
          setPendingOrder(response.data.orders);
          setStatuscounts(response.data.statuscounts);
      }
      catch(errors)
      {
        console.log(errors);
      }
    }

    useEffect(()=>{
      const status="pending";
      fetchPendingOrders(status);
    },[])

    const handlePendingView=()=>{
      const status="pending";
      fetchPendingOrders(status);
        setLabel("pending");
        setCurrentView("pending");
    }

    const handleOngoingView=()=>{
        const status="processing";
        fetchPendingOrders(status);
        setLabel("ongoing");
        setCurrentView("pending");

    }

    const handleCompletedView=()=>{
        const status="completed";
        fetchPendingOrders(status);
        setLabel("completed");
        setCurrentView("pending");

    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Orders</span>
                </h1>
            </div>

            {/* Order Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                {[
                    { label: "Pending Orders", count: statuscounts["pending"], bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
                    { label: "Ongoing Orders", count: statuscounts["ongoing"], bgColor: "bg-blue-100", textColor: "text-blue-600" },
                    { label: "Completed Orders", count: statuscounts["completed"], bgColor: "bg-green-100", textColor: "text-green-600" },
                ].map((status, index) => (
                    <div key={index} className={`p-4 rounded-lg shadow-md ${status.bgColor} ${status.textColor}`}>
                        <h2 className="text-xl font-bold">{status.count}</h2>
                        <p className="text-sm md:text-lg font-medium">{status.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center space-x-4 p-6">
                <button
                    key=""
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                    onClick={() => handlePendingView()}
                >
                    Pending Orders
                </button>
                <button
                    key=""
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                    onClick={() => handleOngoingView()}
                >
                    Ongoing Orders
                </button>
                <button
                    key=""
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                    onClick={() => handleCompletedView()}
                >
                    Completed Orders
                </button>
            </div>

            {/* Orders Table */}

            {currentView === "pending" && (
                <>
                    <div className="w-full p-5">
                        {label==="pending" && (<h1 className="font-bold text-2xl text-yellow-500">Pending Orders</h1>)}
                        {label==="ongoing" && (<h1 className="font-bold text-2xl text-blue-600">Ongoing Orders</h1>)}
                        {label==="completed" && (<h1 className="font-bold text-2xl text-green-500">Completed Orders</h1>)}
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="table-auto w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="px-4 py-2 border">Order ID</th>
                                        <th className="px-4 py-2 border">User</th>
                                        <th className="px-4 py-2 border">Seller</th>
                                        <th className="px-4 py-2 border">Order Status</th>
                                        <th className="px-4 py-2 border">View Orders</th>
                                        <th className="px-4 py-2 border">Payment Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {pendingOrder.map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{order.id}</td>
                                            <td className="px-4 py-2 border">{order.user.email}</td>
                                            <td className="px-4 py-2 border"> <ul>
                                                {
                                                    order.order_lines.map((value,key)=>(
                                                        <li>{value.seller.email}</li>
                                                    ))
                                                }
                                                </ul> </td>
                                            <td className="px-4 py-2 border">
                                                {order?.order_status?.status||"Pending"}
                                            </td>
                                            <td className="px-4 py-2 border"><button onClick={()=>setCurrentView({view:"orderdetails1",data:order})} className="px-2 py-1 bg-blue-600 rounded-md hover:bg-blue-700 text-white">View Order</button></td>
                                            <td className="px-4 py-2 border">{order?.payment_method?.status||"Pending"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {
                currentView.view === "orderdetails1" && (
                    <AdminOrderDetails currentView={currentView} />
                )
            }
        </div>
    );
};

export default OrdersSection;
