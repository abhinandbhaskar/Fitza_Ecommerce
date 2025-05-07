import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ComplaintSection = ({ setCurrentView,setYourComplaint}) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [complaints, setComplaints] = useState([]);
    

    const sellerdata = {
        title: title.trim(),
        description: description.trim(),
    };

    const handleComplaint = async () => {
        try {
            const response = await axios.post("https://127.0.0.1:8000/api/seller/add_seller_complaint/", sellerdata, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
            console.log(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    
    const fetchComplaints = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/seller/view_seller_complaints/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
            setComplaints(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const viewComplaint=async(c)=>{
      setCurrentView("followup") 
      setYourComplaint(c);

    }

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Complaints</span>
                </h1>
            </div>

            <div className="container mx-auto mt-6 px-4">
                {/* Raise Complaint Section */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Raise a Complaint</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-600 font-medium mb-1">Title</label>
                            <input
                                type="text"
                                placeholder="Brief title for the complaint"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium mb-1">Description</label>
                            <textarea
                                placeholder="Detailed description of the complaint"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            onClick={() => handleComplaint()}
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                        >
                            Add Complaint
                        </button>
                    </div>
                </div>

                {/* Your Complaints Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Complaints</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Complaint ID</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Title</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Complaint</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Status</th>
                                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Date</th>
                                    <th className="px-4 py-2 text-center text-gray-600 font-medium">Follow Up</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((c, key) => (
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border border-gray-300">{c.id}</td>
                                        <td className="px-4 py-2 border border-gray-300">{c.title}</td>
                                        <td className="px-4 py-2 border border-gray-300">{c.description}</td>
                                        <td className="px-4 py-2 border border-gray-300">{c.response?"replayed":"pending"}</td>
                                        <td className="px-4 py-2 border border-gray-300">{c.updated_at}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">
                                            <button
                                                onClick={() =>viewComplaint(c)}
                                                className="px-4 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                                            >
                                                Follow Up
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintSection;
