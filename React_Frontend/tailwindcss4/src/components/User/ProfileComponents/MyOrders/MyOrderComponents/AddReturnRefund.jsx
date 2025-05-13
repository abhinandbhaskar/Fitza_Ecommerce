import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AddReturnRefund = ({ orderId }) => {
    const [reason, setReason] = useState("");
    const [refundAmount, setRefundAmount] = useState("");
    const [refundMethod, setRefundMethod] = useState("");
    const [isPartialRefund, setIsPartialRefund] = useState(false);
    const [comments, setComments] = useState("");
    const [supportingFiles, setSupportingFiles] = useState(null);
    const { accessToken } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("reason", reason);
        formData.append("refundAmount", refundAmount);
        formData.append("refundMethod", refundMethod);
        formData.append("isPartialRefund", isPartialRefund);
        formData.append("comments", comments);
        if (supportingFiles) {
            formData.append("supportingFiles", supportingFiles);
        }

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/send_return_refund/${orderId}/`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
        } catch (errors) {
            console.log(errors.response.data);
        }
    };

    return (
        <div className="h-full w-full p-6 flex flex-col bg-gray-50">
            {/* Breadcrumb */}
            <div className="py-2 text-gray-600 text-sm">
                <span>My Orders &gt; </span>
                <span className="font-semibold text-blue-600">Order Details &gt; </span>
                <span className="font-semibold text-blue-600">Return Refund</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reason */}
                <div className="flex flex-col">
                    <label htmlFor="reason" className="text-gray-700">
                        Reason for Return
                    </label>
                    <textarea
                        id="reason"
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="p-2 mt-2 border rounded-md"
                        required
                    />
                </div>

                {/* Refund Amount */}
                <div className="flex flex-col">
                    <label htmlFor="refundAmount" className="text-gray-700">
                        Refund Amount
                    </label>
                    <input
                        type="number"
                        id="refundAmount"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        className="p-2 mt-2 border rounded-md"
                        required
                    />
                </div>

                {/* Refund Method */}
                <div className="flex flex-col">
                    <label htmlFor="refundMethod" className="text-gray-700">
                        Refund Method
                    </label>
                    <select
                        id="refundMethod"
                        value={refundMethod}
                        onChange={(e) => setRefundMethod(e.target.value)}
                        className="p-2 mt-2 border rounded-md"
                        required
                    >
                        <option value="">Select a method</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash_on_delivery">Cash on Delivery</option>
                    </select>
                </div>

                {/* Partial Refund */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isPartialRefund"
                        checked={isPartialRefund}
                        onChange={(e) => setIsPartialRefund(e.target.checked)}
                    />
                    <label htmlFor="isPartialRefund" className="text-gray-700">
                        Partial Refund
                    </label>
                </div>

                {/* Comments */}
                <div className="flex flex-col">
                    <label htmlFor="comments" className="text-gray-700">
                        Additional Comments
                    </label>
                    <textarea
                        id="comments"
                        rows="4"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="p-2 mt-2 border rounded-md"
                    />
                </div>

                {/* Supporting Files */}
                <div className="flex flex-col">
                    <label htmlFor="supportingFiles" className="text-gray-700">
                        Supporting Files (optional)
                    </label>
                    <label className="p-2 mt-2 border rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200">
                        <input
                            type="file"
                            id="supportingFiles"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setSupportingFiles(file);
                                }
                            }}
                        />
                        Choose File
                    </label>
                    {supportingFiles && <span className="mt-2 text-sm text-gray-600">{supportingFiles.name}</span>}
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddReturnRefund;
