import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ReturnRefundSection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [returnRefund, setreturnRefund] = useState([]);

    const [returns, setReturns] = useState([]);

    const [selectedReturn, setSelectedReturn] = useState(null);
    const [notes, setNotes] = useState("");
    const [escalationReason, setEscalationReason] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'completed'

    // Filter returns based on status
    const filteredReturns = returns.filter((returnItem) => {
        if (activeTab === "all") return true;
        return returnItem.status === activeTab;
    });



    const handleEscalate = async(returnId) => {
            console.log("id",returnId);
            const escalationData={
                "escalationReason":escalationReason,
            }
            console.log("escalationReason",escalationData);

            
        try{
            const response = await axios.post(`https://127.0.0.1:8000/api/seller/hanle_escalation/${returnId}/`,escalationData,{
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        });
            console.log(response.data);
        }catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }




    };

    const handleSaveNotes = (id) => {
        setReturns(returns.map((item) => (item.id === id ? { ...item, resolution_notes: notes } : item)));
    };

    const handleMarkReturned=async(returnId)=>{

        console.log(returnId);
        console.log(notes);


        try{
            const response = await axios.post(`https://127.0.0.1:8000/api/seller/hanle_returned/${returnId}/`,{},{
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        });
            console.log(response.data);
        }catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }

    }




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
                    <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                        Seller Dashboard <span className="text-indigo-600">Return & Refund Requests</span>
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
                                className={`px-4 py-2 rounded-md font-medium ${
                                    activeTab === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border"
                                }`}
                            >
                                All Requests
                            </button>
                            <button
                                onClick={() => setActiveTab("pending")}
                                className={`px-4 py-2 rounded-md font-medium ${
                                    activeTab === "pending" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border"
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setActiveTab("completed")}
                                className={`px-4 py-2 rounded-md font-medium ${
                                    activeTab === "completed" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border"
                                }`}
                            >
                                Completed
                            </button>
                        </div>

                        {/* Returns Table */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reason
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        { (activeTab==="all"?returnRefund:returnRefund.filter((item)=>item.status===activeTab)).map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                 {item.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="text-gray-400">
                                                        {item.requested_by.first_name}
                                                        <br /> {item.requested_by.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{item.reason}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${item.refund_amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                                item.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : item.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.request_date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => setSelectedReturn(item)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
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
                                Return/Refund Details - {selectedReturn.order}
                            </h2>
                        </div>

                        {/* Detail Content */}
                        <div className="px-6 py-4 grid md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedReturn.requested_by.first_name}</p>
                                    <p className="text-sm text-gray-500">{selectedReturn.requested_by.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Return Reason</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedReturn.reason}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Requested Amount</h3>
                                    <p className="mt-1 text-sm text-gray-900">${selectedReturn.refund_amount}</p>
                                </div>

                                {selectedReturn.supporting_files && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Supporting Documents</h3>
                                        <a
                                            href={selectedReturn.supporting_files}
                                            className="mt-1 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                                            download
                                        >
                                            [Download] File
                                        </a>
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
                          selectedReturn.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedReturn.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                                        >
                                            {selectedReturn.status}
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
                                        value={selectedReturn.return_date?"Returned":"Not Returned"}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className={`mt-1 block w-full border border-gray-300 rounded-md font-bold ${selectedReturn.return_date ? 'text-green-600' : 'text-red-600'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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

                                    {selectedReturn.status === "pending" && (
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
                                            <button onClick={() => handleEscalate(selectedReturn.id)} className="bg-blue-600 hover:bg-blue-700 rounded-md text-white px-2 py-1 my-2">
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
        </div>
    );
};

export default ReturnRefundSection;
