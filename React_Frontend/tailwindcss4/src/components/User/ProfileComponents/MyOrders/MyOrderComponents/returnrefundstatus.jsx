import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector} from "react-redux";
const ReturnRefundStatus = ({orderId}) => {
    const { accessToken } = useSelector((state) => state.auth);
    const[returnrefund,setReturnrefund]=useState("");

    const fetchReturnRefundStatus=async()=>{

    try {
    const response = await axios.get(`https://127.0.0.1:8000/api/get_returnrefund_status/${orderId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("REs",response);
    console.log("REs",response.data);
    setReturnrefund(response.data);
  } catch (error) {
    console.error("Error fetching return refund:", error);
  }

    }

    useEffect(()=>{
        fetchReturnRefundStatus();
    },[])

    
const refundDetails = [
  {
    orderId: returnrefund.id,
    reason: returnrefund.reason,
    status: returnrefund.status,
    refundAmount: 50.0,
    requestDate: returnrefund.request_date,
    processedDate: "2025-05-13T15:45:00Z",
    refundMethod: returnrefund.refund_amount,
    isPartialRefund: false,
    isEscalated: true,
    escalationReason: "Delay in processing",
    comments: returnrefund.comments,
    resolutionNotes: "Refund processed successfully."
  }
];

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Breadcrumb */}
      <div className="py-2 text-gray-600 text-sm">
        <span>My Orders &gt; </span>
        <span className="font-semibold text-blue-600">Order Details &gt; </span>
        <span className="font-semibold text-blue-600">Return Refund Status</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Return/Refund Status</h1>

      {/* Refund Details */}
      <div className="space-y-4">
        {refundDetails.map((refund, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-700 mb-2">Order ID: {refund.orderId}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium text-gray-800">{refund.reason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${refund.status === 'approved' ? 'text-green-600' : refund.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{refund.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Refund Amount</p>
                <p className="font-medium text-gray-800">${refund.refundAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-medium text-gray-800">{new Date(refund.requestDate).toLocaleDateString()}</p>
              </div>
              {refund.processedDate && (
                <div>
                  <p className="text-sm text-gray-500">Processed Date</p>
                  <p className="font-medium text-gray-800">{new Date(refund.processedDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Refund Method</p>
                <p className="font-medium text-gray-800">{refund.refundMethod || 'Not Available'}</p>
              </div>
              {refund.isPartialRefund && (
                <div>
                  <p className="text-sm text-gray-500">Partial Refund</p>
                  <p className="font-medium text-gray-800">Yes</p>
                </div>
              )}
              {refund.isEscalated && (
                <div>
                  <p className="text-sm text-gray-500">Escalation Reason</p>
                  <p className="font-medium text-gray-800">{refund.escalationReason || 'N/A'}</p>
                </div>
              )}
            </div>

            {refund.comments && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Comments</p>
                <p className="font-medium text-gray-800">{refund.comments}</p>
              </div>
            )}

            {refund.resolutionNotes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Resolution Notes</p>
                <p className="font-medium text-gray-800">{refund.resolutionNotes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReturnRefundStatus;
