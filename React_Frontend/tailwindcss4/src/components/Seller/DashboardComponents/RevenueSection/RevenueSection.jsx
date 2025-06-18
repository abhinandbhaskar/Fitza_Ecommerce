import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { safe } from "../../../../utils/safeAccess";
const RevenueSection = ({ setCurrentView }) => {
    // Sample data - in a real app, this would come from an API

    const { accessToken } = useSelector((state) => state.auth);
    const [recentOrders, setRecentOrders] = useState([]);
    const [sellerRevenue, setSellerRevenue] = useState(0);
    const [sellerEarnings, setSellerEarnings] = useState(0);
    const [refundAmount, setRefundAmount] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");
    const [formattedDate, setFormattedDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const fetchRevenue = async (page = 1) => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/view_seller_revenue/", {
                params: {
                    page: page,
                    page_size: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("REs", response);
            console.log("REs", response.data);
            setRecentOrders(response.data["transactions"]);

            const { count, next, previous } = response.data["pagination"];

            // setRecentOrders(results);
            setTotalItems(count);
            setTotalPages(Math.ceil(count / pageSize));

            setSellerRevenue(response.data["details"].total_revenue);
            setSellerEarnings(response.data["details"].seller_earnings);
            setRefundAmount(response.data["details"].refund_amount);
        } catch (errors) {
            console.log(errors);
        }
    };

    useEffect(() => {
        fetchRevenue(currentPage);
    }, [currentPage, pageSize]);

    //     // Pagination handlers
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const metrics = [
        { title: "Total Revenue", value: sellerRevenue - refundAmount },
        { title: "Seller Earnings", value: sellerEarnings - refundAmount },
        { title: "Refunds Issued", value: refundAmount },
    ];

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); // Store raw date
    };

    const handleFilterClick = () => {
        if (selectedDate) {
            const formatted = new Date(selectedDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
            setFormattedDate(formatted);
            console.log(formatted); // Logs the formatted date
        } else {
            console.log("No date selected");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1
                    onClick={() => setCurrentView("mainsection")}
                    className="text-lg md:text-2xl font-semibold text-gray-700"
                >
                    Dashboard &gt; <span className="text-indigo-600">Revenue</span>
                </h1>
            </div>

            <div className="p-6">
                {/* Key Metrics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {metrics.map((metric, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-gray-500 text-sm font-medium">{safe(metric, "title")}</h3>
                            <div className="mt-2 flex items-baseline justify-between">
                                <p className="text-2xl font-semibold text-gray-900">₹{safe(metric, "value")}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order List with Filters */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Recent Orders</h2>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                            <input
                                type="date"
                                className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm"
                                onChange={handleDateChange}
                            />
                            <button
                                onClick={handleFilterClick}
                                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                            >
                                Filter
                            </button>
                            <button
                                onClick={() => setFormattedDate("")}
                                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                            >
                                Clear Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Invoice Number
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Order Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Order Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Customer Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Order Total
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Payment Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Return refund Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders
                                    .filter((item) => {
                                        if (formattedDate.length > 0) {
                                            return (
                                                formattedDate ===
                                                new Date(item.order.order_date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                            );
                                        }
                                        return true;
                                    })
                                    .map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {safe(order, "invoice_number")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {safe(order, "order.id")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(safe(order, "order.order_date")).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {safe(order, "order.user.first_name") + safe(order, "order.user.last_name")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                Rs.{safe(order, "total_amount")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${
                                                        safe(order, "payment_status") === "paid"
                                                            ? "bg-green-100 text-green-800"
                                                            : safe(order, "payment_status") === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {safe(order, "payment_status")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {safe(order, "returns.[0].status") || "No Returns"}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}

                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                                    <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
                                    <span className="font-medium">{totalItems}</span> results
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm"
                                >
                                    <option value="5">5 per page</option>
                                    <option value="10">10 per page</option>
                                    <option value="20">20 per page</option>
                                    <option value="50">50 per page</option>
                                </select>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        &lt;
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === pageNum
                                                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === totalPages ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        &gt;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueSection;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const RevenueSection = () => {
//     const { accessToken } = useSelector((state) => state.auth);
//     const [recentOrders, setRecentOrders] = useState([]);
//     const [sellerRevenue, setSellerRevenue] = useState(0);
//     const [sellerEarnings, setSellerEarnings] = useState(0);
//     const [refundAmount, setRefundAmount] = useState(0);
//     const [selectedDate, setSelectedDate] = useState("");
//     const [formattedDate, setFormattedDate] = useState("");

//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalItems, setTotalItems] = useState(0);
//     const [pageSize, setPageSize] = useState(10);

//     const fetchRevenue = async (page = 1) => {
//         try {
//             const response = await axios.get("https://127.0.0.1:8000/api/seller/view_seller_revenue/", {
//                 params: {
//                     page: page,
//                     page_size: pageSize
//                 },
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             });

//             const { results, count, next, previous } = response.data;

//             setRecentOrders(results);
//             setTotalItems(count);
//             setTotalPages(Math.ceil(count / pageSize));

//             // Calculate metrics
//             const total_revenue = results.reduce(
//                 (revenue, currentvalue) => revenue + parseFloat(currentvalue.total_amount),
//                 0
//             );
//             setSellerRevenue(total_revenue);

//             const seller_earnings = results.reduce(
//                 (revenue, currentvalue) =>
//                     revenue + parseFloat(currentvalue.total_amount) - parseFloat(currentvalue.payment.platform_fee),
//                 0
//             );
//             setSellerEarnings(seller_earnings);

//             const refund_amount = results.reduce((refund, currentvalue) => {
//                 const returns = currentvalue.order.returns;
//                 if (Array.isArray(returns) && returns.length > 0) {
//                     const totalRefundForOrder = returns.reduce((sum, ret) => {
//                         if (ret.status === "completed") {
//                             return sum + parseFloat(ret.approved_refund_amount);
//                         }
//                         return sum;
//                     }, 0);
//                     return refund + totalRefundForOrder;
//                 }
//                 return refund;
//             }, 0);
//             setRefundAmount(refund_amount);

//         } catch (errors) {
//             console.log(errors);
//         }
//     };

//     useEffect(() => {
//         fetchRevenue(currentPage);
//     }, [currentPage, pageSize]);

//     // Pagination handlers
//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const handlePageSizeChange = (e) => {
//         const newSize = parseInt(e.target.value);
//         setPageSize(newSize);
//         setCurrentPage(1); // Reset to first page when page size changes
//     };

//     // ... rest of your component code remains the same until the pagination section ...

//     // Replace your existing pagination section with this:
//     <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//         <div className="flex-1 flex items-center justify-between">
//             <div>
//                 <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
//                     <span className="font-medium">
//                         {Math.min(currentPage * pageSize, totalItems)}
//                     </span>{' '}
//                     of <span className="font-medium">{totalItems}</span> results
//                 </p>
//             </div>
//             <div className="flex items-center space-x-2">
//                 <select
//                     value={pageSize}
//                     onChange={handlePageSizeChange}
//                     className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm"
//                 >
//                     <option value="5">5 per page</option>
//                     <option value="10">10 per page</option>
//                     <option value="20">20 per page</option>
//                     <option value="50">50 per page</option>
//                 </select>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
//                             currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
//                         }`}
//                     >
//                         <span className="sr-only">Previous</span>
//                         &lt;
//                     </button>
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         let pageNum;
//                         if (totalPages <= 5) {
//                             pageNum = i + 1;
//                         } else if (currentPage <= 3) {
//                             pageNum = i + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                             pageNum = totalPages - 4 + i;
//                         } else {
//                             pageNum = currentPage - 2 + i;
//                         }

//                         return (
//                             <button
//                                 key={pageNum}
//                                 onClick={() => handlePageChange(pageNum)}
//                                 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                                     currentPage === pageNum
//                                         ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
//                                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                                 }`}
//                             >
//                                 {pageNum}
//                             </button>
//                         );
//                     })}
//                     <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
//                             currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
//                         }`}
//                     >
//                         <span className="sr-only">Next</span>
//                         &gt;
//                     </button>
//                 </nav>
//             </div>
//         </div>
//     </div>
