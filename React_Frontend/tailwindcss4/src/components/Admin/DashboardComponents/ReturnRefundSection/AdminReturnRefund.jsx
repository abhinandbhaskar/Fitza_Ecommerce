import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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




    const handleMarkReturned=async(returnId)=>{

        console.log(returnId);
            const returnData = {
            status,
            approved_refund_amount: approvedRefundAmount,
            resolution_notes: resolutionNotes,
        };

        console.log("KIJIJI",returnData);

        try{
            const response = await axios.post(`https://127.0.0.1:8000/api/admin/hanle_mark_returned/${returnId}/`,returnData,{
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







    if (!returnRefund) {
        return <div>Loading return/refund details...</div>;
    }

    return (
        <div className="overflow-x-auto p-6">
            <h2 className="text-xl font-semibold text-gray-700">Return/Refund Management</h2>

                {/* Request Details */}
                <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Request Details</h3>
                    <p><strong>Order ID:</strong> {returnRefund.order}</p>
                    <p><strong>Requested Refund Amount:</strong> {returnRefund.refund_amount}</p>
                    <p><strong>Refund Method:</strong> {returnRefund.refund_method}</p>
                    <p><strong>Reason:</strong> {returnRefund.reason}</p>
                    <p><strong>Escalation Reason</strong> {returnRefund.escalation_reason}</p>
                    {returnRefund.supporting_files && (
                        <p>
                            <strong>Supporting File:</strong> <a href={returnRefund.supporting_files} className="text-blue-600 underline">Download</a>
                        </p>
                    )}
                </div>

                {/* Status */}
                <div className="flex flex-col">
                    <label htmlFor="status" className="text-gray-700">Update Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="p-2 mt-2 border rounded-md"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Approved Refund Amount */}
                <div className="flex flex-col">
                    <label htmlFor="approvedRefundAmount" className="text-gray-700">Approved Refund Amount</label>
                    <input
                        type="number"
                        id="approvedRefundAmount"
                        value={approvedRefundAmount}
                        onChange={(e) => setApprovedRefundAmount(e.target.value)}
                        className="p-2 mt-2 border rounded-md"
                        required
                    />
                </div>

                {/* Resolution Notes */}
                <div className="flex flex-col">
                    <label htmlFor="resolutionNotes" className="text-gray-700">Resolution Notes</label>
                    <textarea
                        id="resolutionNotes"
                        rows="4"
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        className="p-2 mt-2 border rounded-md"
                        required
                    />
                </div>


                {/* Submit Button */}
                <div className="mt-4">
                    <button
                        type="submit"
                        onClick={()=>handleMarkReturned(returnRefund.id)}
                        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Update Request
                    </button>
                </div>
          
        </div>
    );
};

export default AdminReturnRefund;

