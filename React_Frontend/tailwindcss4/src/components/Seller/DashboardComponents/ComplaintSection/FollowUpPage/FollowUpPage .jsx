import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FollowUpPage = ({ yourcomplaint }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [complaintid,setComplaintid]=useState(null);



  const fetchMessages = async () => {
    let cid = yourcomplaint.id;
    setComplaintid(yourcomplaint.id)
    try {
      const response = await axios.get(`https://127.0.0.1:8000/api/seller/view_user_complaints/${cid}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMessages(response.data);
      console.log("SDS",response.data);
    } catch (errors) {
      console.error(errors.response.data || errors.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {

    console.log("New message:", newMessage);
    console.log("New IIIdd:");

            const resolvedata = { "cid":complaintid,"newMessage":newMessage };
    
            try {
                const response = await axios.post("https://127.0.0.1:8000/api/seller/seller_reply_complaint/", resolvedata, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
    
                console.log("API Response:", response.data);
                fetchMessages();

            } catch (error) {
                console.error("API Error:", error.response?.data || error.message);
            }





  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; Complaints &gt; <span className="text-indigo-600">Follow-Up</span>
        </h1>
      </div>

      <div className="container mx-auto mt-6 px-4">
        {/* Complaint Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Complaint Details</h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>ID:</strong> {yourcomplaint.id}</li>
            <li><strong>Title:</strong> {yourcomplaint.title}</li>
            <li><strong>Description:</strong> {yourcomplaint.description}</li>
            <li><strong>Date Filed:</strong> {yourcomplaint.updated_at}</li>
            <li><strong>Status:</strong> {yourcomplaint.response ? "Replied" : "Pending"}</li>
          </ul>
        </div>

        {/* Communication Thread */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Follow-Up Messages</h2>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender.user_type === "admin" ? "justify-start" : "justify-end"}`}
              >
              
                <div className={`${msg.sender.user_type === "admin" ? "bg-gray-100" : "bg-indigo-100"} p-4 rounded-lg max-w-md`}>
                  <p className="text-gray-700">
                    <strong>{msg.sender.user_type === "admin" ? "Admin" : "You"} <span className="text-sm ">({new Date(msg.timestamp).toLocaleDateString()})</span> :</strong>{" "}
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add a new message */}
          <div className="mt-4">
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <button
              onClick={()=>handleSendMessage()}
              className="mt-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpPage;
