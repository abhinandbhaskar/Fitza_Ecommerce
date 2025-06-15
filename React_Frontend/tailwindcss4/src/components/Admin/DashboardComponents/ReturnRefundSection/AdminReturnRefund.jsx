import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { safe } from "../../../../utils/safeAccess";

const AdminReturnRefund = ({ refundobj }) => {
    const [returnRefund, setReturnRefund] = useState(null);
    const [status, setStatus] = useState("pending");
    const [approvedRefundAmount, setApprovedRefundAmount] = useState(0);
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [escalationReason, setEscalationReason] = useState("");
    const { accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchReturnRefund = async () => {
            setReturnRefund(refundobj);
            setStatus(refundobj.status);
            setApprovedRefundAmount(refundobj.approved_refund_amount || refundobj.refund_amount);
            setResolutionNotes(refundobj.resolution_notes || "");
            setEscalationReason(refundobj.escalation_reason || "");
        };

        fetchReturnRefund();
    }, [refundobj, accessToken]);

    const handleMarkReturned = async (returnId) => {
        console.log(returnId);
        const returnData = {
            status,
            approved_refund_amount: approvedRefundAmount,
            resolution_notes: resolutionNotes,
        };

        console.log("KIJIJI", returnData);

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/hanle_mark_returned/${returnId}/`,
                returnData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    if (!returnRefund) {
        return <div>Loading return/refund details...</div>;
    }

    return (
        <div className="overflow-x-auto p-6">
            <h2 className="text-xl font-semibold text-gray-700">Return/Refund Management</h2>

            {/* Request Details */}
            <div className="border p-4 rounded-md border-gray-400 bg-gray-50">
                <h3 className="font-semibold text-gray-700">Request Details</h3>
                <p>
                    <strong>Order ID:</strong> {safe(returnRefund, "order")}
                </p>
                <p>
                    <strong>Requested Refund Amount:</strong> {safe(returnRefund, "refund_amount")}
                </p>
                <p>
                    <strong>Refund Method:</strong> {safe(returnRefund, "refund_method")}
                </p>
                <p>
                    <strong>Reason:</strong> {safe(returnRefund, "reason")}
                </p>
                <p>
                    <strong>Escalation Reason</strong> {safe(returnRefund, "escalation_reason") || "Not Added"}
                </p>
                <img
                    src={
                        safe(returnRefund, "supporting_files") &&
                        returnRefund.supporting_files.length > 0 &&
                        `https://127.0.0.1:8000/${returnRefund.supporting_files}`
                    }
                    className="h-34 w-34 border-2 border-gray-700"
                    alt="Profile"
                />

                {safe(returnRefund, "supporting_files") && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Supporting Documents</h3>
                        <div className="mt-1 space-y-1">
                            {returnRefund.supporting_files.split(",").map((filePath, index) => {
                                // Extract filename from path
                                returnRefund.supporting_files.split(",").map((filePath) => filePath.trim());
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

            {/* Status */}
            <div className="flex flex-col">
                <label htmlFor="status" className="text-gray-700">
                    Update Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2 mt-2 border rounded-md border-gray-400"
                >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Approved Refund Amount */}
            <div className="flex flex-col">
                <label htmlFor="approvedRefundAmount" className="text-gray-700">
                    Approved Refund Amount
                </label>
                <input
                    type="number"
                    id="approvedRefundAmount"
                    value={approvedRefundAmount}
                    onChange={(e) => setApprovedRefundAmount(e.target.value)}
                    className="p-2 mt-2 border rounded-md border-gray-400"
                    required
                />
            </div>

            {/* Resolution Notes */}
            <div className="flex flex-col">
                <label htmlFor="resolutionNotes" className="text-gray-700">
                    Resolution Notes
                </label>
                <textarea
                    id="resolutionNotes"
                    rows="4"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="p-2 mt-2 border rounded-md border-gray-400"
                    required
                />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
                <button
                    type="submit"
                    onClick={() => handleMarkReturned(returnRefund.id)}
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Update Request
                </button>
            </div>
        </div>
    );
};

export default AdminReturnRefund;
