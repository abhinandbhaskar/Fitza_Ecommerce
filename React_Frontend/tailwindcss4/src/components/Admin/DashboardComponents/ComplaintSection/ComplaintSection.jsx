import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ComplaintSection = () => {
    const [selectedComplaint, setSelectedComplaint] = useState(0);
    const [newMessage, setNewMessage] = useState("");
    const { accessToken } = useSelector((state) => state.auth);
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [solvedstatus, setSolvedStatus] = useState("All");
    const [cid, setCid] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSendMessage = async () => {
        console.log("MSG", newMessage);

        const info = {
            "newMessage": newMessage,
            "cid": cid,
        }
        console.log("K", info);

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/admin/admin_reply/", info, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
            console.log(response.data);
            fetchComplaints();
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }

        if (!newMessage.trim()) return;

        const updatedComplaints = [...complaints];
        updatedComplaints[selectedComplaint].messages.push({
            sender: "admin1",
            message: newMessage,
            timestamp: new Date().toISOString(),
        });

        setComplaints(updatedComplaints);
        setNewMessage("");
    };

    const toggleResolvedStatus = async (currentStatus, id) => {
        const newStatus = !currentStatus;
        const resolvedata = { id, status: newStatus };

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/admin/resolve_complaint/", resolvedata, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("API Response:", response.data);

            const updatedComplaints = complaints.map((complaint) =>
                complaint.id === id ? { ...complaint, resolved: newStatus } : complaint
            );
            setComplaints(updatedComplaints);
            filterComplaints(searchTerm, solvedstatus, updatedComplaints);
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
        }
    };

    const handleStatus = (status) => {
        console.log("Selected Status:", status);
        setSolvedStatus(status);
        filterComplaints(searchTerm, status);
    };

    const fetchComplaints = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/view_all_complaints/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
            setComplaints(response.data);
            filterComplaints(searchTerm, solvedstatus, response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const handleSelectedComplaint = (index, id) => {
        setSelectedComplaint(index)
        setCid(id);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterComplaints(term, solvedstatus);
    };

    const filterComplaints = (searchTerm = "", status = solvedstatus, complaintsList = complaints) => {
        let filteredList = [...complaintsList];
        
        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredList = filteredList.filter(
                (complaint) =>
                    complaint.title.toLowerCase().includes(term) ||
                    complaint.description.toLowerCase().includes(term) ||
                    (complaint.seller?.first_name?.toLowerCase()?.includes(term) || "")
            );
        }

        // Filter by status
        if (status === "Resolved") {
            filteredList = filteredList.filter((complaint) => complaint.resolved);
        } else if (status === "Unresolved") {
            filteredList = filteredList.filter((complaint) => !complaint.resolved);
        }

        setFilteredComplaints(filteredList);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Complaint</span>
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row p-4 gap-4">
                {/* Left Panel - Complaint List */}
                <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-4">
                    <div className="mb-4 flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e)=>handleSearch(e.target.value)}
                        />
                        <select
                            onChange={(e) => handleStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="All">All Status</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Unresolved">Unresolved</option>
                        </select>
                    </div>

                    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {filteredComplaints.map((complaint, index) => (
                            <div
                                key={complaint.id}
                                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                    selectedComplaint === index ? "border-indigo-500 bg-indigo-50" : ""
                                }`}
                                onClick={() => handleSelectedComplaint(index,complaint.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-800 truncate">{complaint.title}</h3>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            complaint.resolved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {complaint.resolved ? "Resolved" : "Unresolved"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {complaint.description.length > 40
                                        ? `${complaint.description.slice(0, 40)}...`
                                        : complaint.description}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(complaint.created_at).toLocaleDateString()} •{" "}
                                    {new Date(complaint.created_at).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                {complaint.messages.some((msg) => msg.sender !== "admin1") && (
                                    <div className="mt-2 flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                                        <span className="text-xs text-gray-500">New message</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Complaint Detail */}

                {complaints.length > 0 && (
                    <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-4 flex flex-col">
                        <div className="border-b pb-4 mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {complaints[selectedComplaint].title}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        From:{" "}
                                        <span className="font-medium">
                                            {complaints[selectedComplaint].seller.first_name}
                                        </span>{" "}
                                        • Created: {new Date(complaints[selectedComplaint].created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        toggleResolvedStatus(
                                            complaints[selectedComplaint].resolved,
                                            complaints[selectedComplaint].id
                                        )
                                    }
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        complaints[selectedComplaint].resolved
                                            ? "bg-gray-200 text-gray-800"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    }`}
                                >
                                    {complaints[selectedComplaint].resolved ? "Reopen" : "Mark as Resolved"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">Original Complaint:</h4>
                            <p className="text-gray-600">{complaints[selectedComplaint].description}</p>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">Admin Response:</h4>
                            <p className="text-gray-600">{complaints[selectedComplaint].response || "No response yet"}</p>
                        </div>

                        <div className="flex-grow mb-4 overflow-y-auto max-h-[300px] space-y-4">
                            <h4 className="font-medium text-gray-700">Conversation:</h4>
                            {complaints[selectedComplaint].messages.map((msg, index) => (
          
                                <div
                                    key={index}
                                    className={`flex ${msg.sender.user_type === "admin" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            msg.sender.user_type === "admin"
                                                ? "bg-indigo-100 text-indigo-900"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        <p className="font-medium text-sm">{msg.sender.user_type==="admin"?"admin": `(${msg.sender.user_type}) `+ msg.sender.first_name}</p>
                                        {/* <h1 className="bg-red-400">{msg.sender.user_type}</h1> */}
                                        <p className="my-1">{msg.message}</p>
                                        <p className="text-xs text-gray-500 text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your response..."
                                    className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintSection;














