import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { safe } from "../../../../utils/safeAccess";
const UsersSection = ({ searchTerm,setCurrentView }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const fetchOrderedUsers = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/view_ordered_users/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("[][]", response.data);
            setUsers(response.data);
            const totalUsers = response.data.length;
            console.log("Total Users:", totalUsers);
            setUserCount(totalUsers);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        fetchOrderedUsers();
    }, []);

    useEffect(() => {
        console.log("Use", searchTerm);
        if (searchTerm.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter((user) => {
                const UserName = `${user.FullName}`.toLowerCase();
                const search = searchTerm.toLowerCase();
                return UserName.includes(search);
            });
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    <span onClick={()=>setCurrentView("mainsection")}>Dashboard</span> &gt; <span className="text-indigo-600">Users</span>
                </h1>
            </div>

            <div className="mt-4 bg-blue-50 p-4 rounded-lg shadow-sm flex items-center gap-4">
                <p className="text-gray-600 flex items-center text-base md:text-lg">
                    <span className="text-green-700 text-sm font-medium mr-2"> Our Products Ordered Users : </span>
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-lg font-semibold">
                        {userCount}
                    </span>
                </p>
            </div>

            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>OrderDate</th>
                                <th>Total Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, key) => (
                                <tr className="hover:bg-gray-100 transition duration-200">
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">{key + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {safe(user, "FullName")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {safe(user, "Email")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {safe(user, "Phone")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold border-b border-gray-300 text-center">
                                        {safe(user, "OrderDate")
                                            ? new Date(safe(user, "OrderDate")).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                        {safe(user, "TotalOrders")}
                                    </td>
                                </tr>
                            ))}

                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersSection;
