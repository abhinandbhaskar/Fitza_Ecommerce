import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const SellerSection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [sellers, setSellers] = useState([]);
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState(true);


    const fetchSellers = async () => {
        try {
            const response = await fetch("https://127.0.0.1:8000/api/admin/view_sellers/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setSellers(data);
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        } finally {
            console.log("Completed....");
            setLoading(false);
        }
    };



    const pendingApplication = async () => {
        setCurrentView(false);
        try {
            const response = await fetch(`https://127.0.0.1:8000/api/admin/view_seller_approvals/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setApprovals(data);
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        } finally {
            console.log("Completed....");
            setLoading(false);
        }
    };



    useEffect(() => {
        if (currentView===true) {
            ourSellers();
            console.log("True");
        } else {
            pendingApplication();
            console.log("False");
        }
    }, []);




    const ourSellers = () => {
        setCurrentView(true);
        fetchSellers();
    };





    const approveSeller = async(seller_id) => {
        try{
            const response=await axios.post(`https://127.0.0.1:8000/api/admin/approve_seller/${seller_id}/`,{},
                {
                    headers:{
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            )
            if(response.status===200)
            {
                alert("Seller Approved successfully...");
                // fetchSellers();
                pendingApplication();
            }
        }
        catch(errors)
        {
            console.log(errors);
            console.log(errors.data.response);
        }
    };

    const removeSeller = async (seller_id) => {
        console.log("se", seller_id);

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/remove_seller/${seller_id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                alert("Seller Removed..");
                fetchSellers();
            }
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const handleRemove = (seller_id) => {
        if (window.confirm("Are You Sure do you wanna remove Seller"));
        {
            removeSeller(seller_id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Seller</span>
                </h1>
            </div>
            <div className="w-full bg-white shadow-md py-4 px-6">
                <button
                    onClick={() => ourSellers()}
                    className="px-2 py-1 bg-green-500 rounded-md text-white m-1 hover:bg-green-600 border-1 border-gray-400 shadow-xl"
                >
                    Approved Sellers
                </button>
                <button
                    onClick={() => pendingApplication()}
                    className="px-2 py-1 bg-orange-500 rounded-md text-white m-1 hover:bg-orange-600 border-1 border-gray-400 shadow-xl"
                >
                    Pending Application
                </button>
            </div>
            {currentView ? (
                 <div className="w-full bg-white shadow-md py-4 px-6">
                    <h1 className="p-2 text-blue-700 font-bold text-sm">Our Sellers</h1>
                </div>
            ) : (
                <div className="w-full bg-white shadow-md py-4 px-6">
                    <h1 className="p-2 text-red-700 font-bold text-sm"> Pending Approvals</h1>
                </div>
            )}

            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    {loading ? (
                        <p className="text-center text-gray-600 py-4">Loading users...</p>
                    ) : (
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
                                    {currentView?(<></>):(<th>Approve Seller</th>)}
                                    <th>Remove Seller</th>
                                </tr>
                            </thead>
                            {currentView ? (
                                <tbody>
                                    {sellers.length > 0 ? (
                                        sellers.map((sellers) => (
                                            <tr key={sellers.id} className="hover:bg-gray-100 transition duration-200">
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.user.first_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.shop_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-green-600 font-semibold border-b border-gray-300">
                                                    20/05/2025
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    <Link
                                                        to={`/admin/viewseller/${sellers.id}`}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    Approve
                                                </td>

                                                <td className="px-6 py-4 text-sm border-b border-gray-300">
                                                    <button
                                                        onClick={() => handleRemove(sellers.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            ) : (
                                <tbody>
                                    {approvals.length > 0 ? (
                                        approvals.map((sellers) => (
                                            <tr key={sellers.id} className="hover:bg-gray-100 transition duration-200">
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.user.first_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    {sellers.shop_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-green-600 font-semibold border-b border-gray-300">
                                                    20/05/2025
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    <Link
                                                        to={`/admin/viewseller/${sellers.id}`}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    Approve
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                                    <button
                                                        onClick={() => approveSeller(sellers.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                                    >
                                                        Approve
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm border-b border-gray-300">
                                                    <button
                                                        onClick={() => handleRemove(sellers.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                                            >
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )}
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerSection;
