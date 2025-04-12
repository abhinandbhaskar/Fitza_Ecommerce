import React from "react";

const SellerSection = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Seller</span>
                </h1>
            </div>

            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>Seller ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Shop Name</th>
                            <th>Registration Date</th>
                            <th>View Profile</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                        <tbody>
                            <tr className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    #111
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    Abhinand Bhaskar
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    abhinandbhaskar@gmail.com
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    Lavanya Silks
                                </td>
                                <td className="px-6 py-4 text-sm text-green-600 font-semibold border-b border-gray-300">
                                20/05/2025
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                                        View
                                    </button>                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                Approve
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                                        Approve User
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-sm border-b border-gray-300">
                                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
                                        Remove User
                                    </button>
                                </td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerSection;