import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { safe } from "../../../../utils/safeAccess";
import { toast } from "react-toastify"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReturnRefundSection = ({setCurrentView}) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [returnRefund, setreturnRefund] = useState([]);

    const [returns, setReturns] = useState([]);

    const [selectedReturn, setSelectedReturn] = useState(null);
    const [notes, setNotes] = useState("");
    const [escalationReason, setEscalationReason] = useState("");
    const [activeTab, setActiveTab] = useState("all"); 

    const filteredReturns = returns.filter((returnItem) => {
        if (activeTab === "all") return true;
        return returnItem.status === activeTab;
    });

    const handleEscalate = async (returnId) => {
        console.log("id", returnId);
        const escalationData = {
            escalationReason: escalationReason,
        };
        console.log("escalationReason", escalationData);

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/seller/hanle_escalation/${returnId}/`,
                escalationData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response.data);
            toast.success("Escalation Reason Added");
        } catch (errors) {
            toast.error("Add reason first...");
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const handleSaveNotes = (id) => {
        setReturns(returns.map((item) => (item.id === id ? { ...item, resolution_notes: notes } : item)));
    };

    const handleMarkReturned = async (returnId) => {
        console.log(returnId);
        console.log(notes);

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/seller/hanle_returned/${returnId}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response.data);
            toast.success("Product returned...");
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const fetchReturnRefund = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/get_all_returnrefund/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
            console.log(response.data);
            setreturnRefund(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        fetchReturnRefund();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm py-4 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 onClick={()=>setCurrentView("mainsection")} className="text-lg md:text-xl font-semibold text-gray-800">
                        Seller Dashboard <span className="text-indigo-600">Return & Refund</span>
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {!selectedReturn ? (
                    <>
                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <button
                                onClick={() => setActiveTab("all")}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                            >
                                All Requests
                            </button>
                            <button
                                onClick={() => setActiveTab("pending")}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setActiveTab("completed")}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                            >
                                Completed
                            </button>
                        </div>

                        {/* Returns Table */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table  className="min-w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th>
                                                Order ID
                                            </th>
                                            <th>
                                                Customer
                                            </th>
                                            <th>
                                                Reason
                                            </th>
                                            <th>
                                                Amount
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                            <th>
                                                Date
                                            </th>
                                            <th>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(activeTab === "all"
                                            ? returnRefund
                                            : returnRefund.filter((item) => safe(item,'status') === activeTab)
                                        ).map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {safe(item,'id')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    <div className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                        {safe(item,'requested_by.first_name')}
                                                        <br /> {safe(item,'requested_by.email')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{safe(item,'reason')}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    Rs.{safe(item,'refund_amount')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                                safe(item,'status') === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : item.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                                                    >
                                                        {safe(item,'status')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                     {safe(item, "request_date") ? new Date(safe(item, "request_date")).toLocaleString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    <button
                                                        onClick={() => setSelectedReturn(item)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3 font-medium"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Detail View Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                            <button
                                onClick={() => setSelectedReturn(null)}
                                className="mr-4 text-gray-500 hover:text-gray-700"
                            >
                                ← Back
                            </button>
                            <h2 className="text-lg font-medium text-gray-900">
                                Return/Refund Details - {safe(selectedReturn,'order')}
                            </h2>
                        </div>

                        {/* Detail Content */}
                        <div className="px-6 py-4 grid md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">Customer Information</h3>
                                    <p className="mt-1 text-sm text-gray-900">{safe(selectedReturn,'requested_by.first_name')}</p>
                                    <p className="text-sm text-gray-600">{safe(selectedReturn,'requested_by.email')}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700">Return Reason</h3>
                                    <p className="mt-1 text-sm text-gray-900">{safe(selectedReturn,'reason')}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Requested Amount</h3>
                                    <p className="mt-1 text-sm text-gray-900">${safe(selectedReturn,'refund_amount')}</p>
                                </div>

                                <img
                                    src={
                                        safe(selectedReturn,'supporting_files') &&
                                        selectedReturn.supporting_files.length > 0 &&
                                        `https://127.0.0.1:8000/${safe(selectedReturn,'supporting_files')}`
                                    }
                                    className="h-34 w-34 border-2 border-gray-700"
                                    alt="Profile"
                                />

                                {safe(selectedReturn,'supporting_files') && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Supporting Documents</h3>
                                        <div className="mt-1 space-y-1">
                                            {safe(selectedReturn,'supporting_files').split(",").map((filePath, index) => {
                                                // Extract filename from path
                                                safe(selectedReturn,'supporting_files')
                                                    .split(",")
                                                    .map((filePath) => filePath.trim());
                                                const fileName = filePath.split("/").pop();
                                                return (
                                                    <div key={index} className="flex items-center">
                                                        <a
                                                            href={filePath}
                                                            className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
                                                            download={fileName}
                                                        >
                                                            <svg
                                                                className="w-4 h-4 mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                />
                                                            </svg>
                                                            {fileName}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Seller Actions */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                    <div className="mt-1 flex items-center">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded 
                      ${
                          safe(selectedReturn,'status') === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : safe(selectedReturn,'status') === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                                        >
                                            {safe(selectedReturn,'status')}
                                        </span>
                                    </div>
                                </div>

                                {/* Seller Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Product returned (Visible to Admin)
                                    </label>
                                    <input
                                        id="notes"
                                        rows={3}
                                        value={safe(selectedReturn,'return_date') ? "Returned" : "Not Returned"}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className={`mt-1 block w-full border border-gray-300 rounded-md font-bold ${
                                            safe(selectedReturn,'return_date') ? "text-green-600" : "text-red-600"
                                        } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    />
                                    <button
                                        onClick={() => handleMarkReturned(selectedReturn.id)}
                                        className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Returned
                                    </button>
                                </div>

                                {/* Seller Actions */}
                                <div className="space-y-3">
                                    {safe(selectedReturn,'status') === "pending" && (
                                        <div className="pt-2">
                                            <label htmlFor="escalation" className="block text-sm font-medium text-gray-700">
                                                Escalate to Admin
                                            </label>
                                            <textarea
                                                id="escalation"
                                                rows={2}
                                                value={escalationReason}
                                                onChange={(e) => setEscalationReason(e.target.value)}
                                                placeholder="Reason for escalation..."
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            <button
                                                onClick={() => handleEscalate(selectedReturn.id)}
                                                className="bg-blue-600 hover:bg-blue-700 rounded-md text-white px-2 py-1 my-2"
                                            >
                                                [!] Escalate Request
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ReturnRefundSection;
