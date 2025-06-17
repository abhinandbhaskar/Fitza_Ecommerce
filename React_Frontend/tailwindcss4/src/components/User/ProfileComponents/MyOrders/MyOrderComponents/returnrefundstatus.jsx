import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { safe } from "../../../../../utils/safeAccess";

const ReturnRefundStatus = ({ orderId,setMyOrderView,setCurrentView }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [returnrefund, setReturnrefund] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReturnRefundStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://127.0.0.1:8000/api/get_returnrefund_status/${orderId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setReturnrefund(safe(response, "data"));
      setError(null);
    } catch (error) {
      console.error("Error fetching return refund:", error);
      setError("Failed to fetch return/refund status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRefundStatus();
  }, [orderId]);

  const refundDetails = [
    {
      orderId: safe(returnrefund, "order"),
      reason: safe(returnrefund, "reason"),
      status: safe(returnrefund, "status"),
      refundAmount: safe(returnrefund, "refund_amount"),
      approvedRefundAmount: safe(returnrefund, "approved_refund_amount"),
      requestDate: safe(returnrefund, "request_date"),
      processedDate: safe(returnrefund, "processed_date"),
      refundMethod: safe(returnrefund, "refund_method"),
      isPartialRefund: safe(returnrefund, "is_partial_refund"),
      isEscalated: safe(returnrefund, "is_escalated"),
      escalationReason: safe(returnrefund, "escalation_reason"),
      comments: safe(returnrefund, "comments"),
      returnDate: safe(returnrefund, "return_date"),
    },
  ];

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-purple-100 text-purple-800",
    };

    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    const statusClass = statusClasses[status] || "bg-gray-100 text-gray-800";

    return (
      <span className={`${baseClass} ${statusClass}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 flex flex-col bg-gray-50">
      {/* Breadcrumb */}
      <div className="py-2 text-gray-600 text-sm">
          <button 
        className="text-blue-500 hover:text-blue-700 hover:underline"
        onClick={() => {
            setCurrentView("myorders");
            setMyOrderView("myorder");
        }}
    >   My Orders  &gt; </button>
        {/* <span className="font-semibold text-blue-600">Order Details &gt; </span> */}
        <span className="font-semibold text-blue-600">Return Refund Status</span>
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Return/Refund Status</h1>
      </div>

      {/* Refund Details */}
      <div className="space-y-6">
        {refundDetails.map((refund, index) => (
          <div
            key={index}
            className="bg-white p-6 shadow-sm rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Order ID: #ORD-{refund.orderId || "N/A"}
              </h2>
              <div>{getStatusBadge(refund.status)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Request Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                  Request Information
                </h3>
                <div>
                  <p className="text-sm text-gray-500">Reason for Return</p>
                  <p className="font-medium text-gray-800">
                    {refund.reason || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(refund.requestDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Return Date</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(refund.returnDate)}
                  </p>
                </div>
              </div>

              {/* Refund Details */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                  Refund Details
                </h3>
                <div>
                  <p className="text-sm text-gray-500">Requested Amount</p>
                  <p className="font-medium text-gray-800">
                    {formatCurrency(refund.refundAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved Amount</p>
                  <p className="font-medium text-gray-800">
                    {formatCurrency(refund.approvedRefundAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Refund Method</p>
                  <p className="font-medium text-gray-800">
                    {refund.refundMethod || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Partial Refund</p>
                  <p className="font-medium text-gray-800">
                    {refund.isPartialRefund ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Processing Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-700 border-b pb-2">
                  Processing Information
                </h3>
                <div>
                  <p className="text-sm text-gray-500">Processed Date</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(refund.processedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Escalated</p>
                  <p className="font-medium text-gray-800">
                    {refund.isEscalated ? "Yes" : "No"}
                  </p>
                </div>
                {refund.isEscalated && (
                  <div>
                    <p className="text-sm text-gray-500">Escalation Reason</p>
                    <p className="font-medium text-gray-800">
                      {refund.escalationReason || "Not specified"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Comments */}
            {refund.comments && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Additional Comments
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800">{refund.comments}</p>
                </div>
              </div>
            )}

            {/* Timeline (optional) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-700 mb-4">
                Refund Timeline
              </h3>
              <div className="relative">
                <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
                
                {/* Request Submitted */}
                <div className="relative mb-6 pl-8">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-800">Request Submitted</p>
                    <p className="text-xs text-gray-500">{formatDate(refund.requestDate)}</p>
                  </div>
                </div>
                
                {/* Processing */}
                {refund.processedDate && (
                  <div className="relative mb-6 pl-8">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-800">
                        {refund.status === 'approved' ? 'Refund Approved' : refund.status === 'rejected' ? 'Refund Rejected' : 'Processing'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(refund.processedDate)}</p>
                      {refund.status === 'approved' && (
                        <p className="text-xs mt-1 text-gray-600">Approved amount: {formatCurrency(refund.approvedRefundAmount)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReturnRefundStatus;