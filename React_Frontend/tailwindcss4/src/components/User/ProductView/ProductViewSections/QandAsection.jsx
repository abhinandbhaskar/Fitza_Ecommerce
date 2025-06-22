import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { safe } from '../../../../utils/safeAccess';

const QandAsection = ({ product }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");


    const handleQuestionChange = (e) => setNewQuestion(e.target.value);

    const handleAskQuestion = async () => {
        const questionData = {
            pid: product?.id,
            question: newQuestion,
        };
        try {
            const response = await axios.post("https://127.0.0.1:8000/api/ask_question/", questionData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
            console.log(response.data);
             toast.success("Your question has been posted successfully!");
            fetchQandA(); 
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
            toast.error("Failed to add question..");
        }
    };

    const fetchQandA = async () => {
        const pid=product?.id;
        console.log("P",pid);
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/get_question_answer/${pid}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            setQuestions(safe(response,'data')); // Set the fetched data to state
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        fetchQandA();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg border">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Q&A</h2>

            {/* Existing Questions and Answers */}
            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={safe(q,'id')} className="p-4 bg-gray-100 rounded-md border border-gray-300">
                        <div className="flex items-center mb-3">
                            <img
                                src={ "https://127.0.0.1:8000/"+safe(q,'avatar') || "https://i.pravatar.cc/150?img=1"} // Default avatar if not provided
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <div className="font-semibold text-gray-700">{safe(q,'user')}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(safe(q,'askedAt')).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-600">{safe(q,'question')}</div>
                        {q.answer ? (
                            <div className="mt-2">
                                <div className="font-semibold text-gray-700">Answer:</div>
                                <div className="text-gray-800">{safe(q,'answer')}</div>
                            </div>
                        ) : (
                            <div className="mt-2 text-gray-500 italic">No answer yet...</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Ask New Question Form */}
            <div className="mt-6">
                <textarea
                    value={newQuestion}
                    onChange={handleQuestionChange}
                    placeholder="Ask a question about this product"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                />
                <button
                    onClick={handleAskQuestion}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                    Submit Question
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default QandAsection;
