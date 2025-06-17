import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const AddReturnRefund = ({ setCurrentView,orderId,setMyOrderView }) => {
    const [reason, setReason] = useState("");
    const [refundAmount, setRefundAmount] = useState("");
    const [refundMethod, setRefundMethod] = useState("");
    const [isPartialRefund, setIsPartialRefund] = useState(false);
    const [comments, setComments] = useState("");
    const [supportingFiles, setSupportingFiles] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { accessToken } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

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
            const response = await axios.post(
                `https://127.0.0.1:8000/api/send_return_refund/${orderId}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setSuccessMessage("Your return/refund request has been submitted successfully!");
            // Reset form
            setReason("");
            setRefundAmount("");
            setRefundMethod("");
            setIsPartialRefund(false);
            setComments("");
            setSupportingFiles(null);
            toast.success("Your return/refund request has been submitted successfully!");
        } catch (error) {
            console.error("Error submitting request:", error);
            setErrorMessage(
                error.response?.data?.message || 
                "An error occurred while submitting your request. Please try again."
            );
            toast.error(error.response.data.errors.non_field_errors[0]);
            console.log("error",error.response.data.errors.non_field_errors[0]);
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl p-6 bg-white rounded-lg shadow-sm">
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                       

  <button 
        className="text-blue-500 hover:text-blue-700 hover:underline"
        onClick={() => {
            setCurrentView("myorders");
            setMyOrderView("myorder");
        }}
    >   My Orders</button>

                    </li>
                    <li>
                        
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="ml-1 text-sm font-medium text-blue-600 md:ml-2">
                                Request Return/Refund
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Request Return or Refund</h1>
                <p className="text-gray-600 mt-2">
                    Please fill out the form below to request a return or refund for your order.
                </p>
            </div>

            {/* Status Messages */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700">{errorMessage}</span>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Refund Amount */}
                    <div className="sm:col-span-1">
                        <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700 mb-1">
                            Refund Amount *
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">Rs . </span>
                            </div>
                            <input
                                type="number"
                                id="refundAmount"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Refund Method */}
                    <div className="sm:col-span-1">
                        <label htmlFor="refundMethod" className="block text-sm font-medium text-gray-700 mb-1">
                            Refund Method *
                        </label>
                        <select
                            id="refundMethod"
                            value={refundMethod}
                            onChange={(e) => setRefundMethod(e.target.value)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        >
                            <option value="">Select a method</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="store_credit">Store Credit</option>
                        </select>
                    </div>
                </div>

                {/* Partial Refund */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isPartialRefund"
                        checked={isPartialRefund}
                        onChange={(e) => setIsPartialRefund(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPartialRefund" className="ml-2 block text-sm text-gray-700">
                        This is a partial refund (only part of the order will be refunded)
                    </label>
                </div>

                {/* Reason */}
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Return/Refund *
                    </label>
                    <textarea
                        id="reason"
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Please explain why you're requesting a return or refund..."
                        required
                    />
                </div>

                {/* Comments */}
                <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Comments
                    </label>
                    <textarea
                        id="comments"
                        rows={3}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Any additional information that might help us process your request..."
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional</p>
                </div>

                {/* Supporting Files */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supporting Documents
                    </label>
                    <div className="mt-1 flex items-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                                type="file"
                                id="supportingFiles"
                                className="sr-only"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setSupportingFiles(file);
                                    }
                                }}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </label>
                        <p className="pl-1 text-sm text-gray-500">(PDF, JPG, PNG up to 5MB)</p>
                    </div>
                    {supportingFiles && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                            </svg>
                            <span>{supportingFiles.name}</span>
                            <button
                                type="button"
                                onClick={() => setSupportingFiles(null)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : 'Submit Request'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Help Section */}
            <div className="mt-12 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Need help with your return?</h3>
                <p className="text-sm text-gray-600 mb-3">
                    Our customer service team is here to help with your return or refund request.
                </p>
                <div className="flex items-center text-sm text-blue-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>Contact Customer Support</span>
                </div>
            </div>
            <ToastContainer /> 
        </div>
    );
};

export default AddReturnRefund;