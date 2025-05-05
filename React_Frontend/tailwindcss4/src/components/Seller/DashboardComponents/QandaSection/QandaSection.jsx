import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const QandaSection = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);

  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://127.0.0.1:8000/api/seller/user_view_questions/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleQuestionClick = (q) => {
    setSelectedQuestion(q);
    setAnswer(""); // Reset the answer field
  };

  const handleViewProduct = (id) => {
    console.log("Viewing Product ID:", id);
    setShowProductModal(true);
  };

  const closeModal = () => {
    setShowProductModal(false);
  };

  const handleReply = async (qid) => {
    if (!answer.trim()) {
      setError("Answer cannot be empty!");
      return;
    }
  
    const answerData = {
      qid: qid,
      answer: answer,
    };
  
    try {
      const response = await axios.post(
        "https://127.0.0.1:8000/api/seller/user_answer/",
        answerData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === qid ? { ...q, isAnswered: true, answer_text: answer } : q
        )
      );
      setAnswer(""); // Clear the answer field
      setError(null); // Clear any existing errors
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit the answer.");
    }
  };
  

  const filteredQuestions = questions.filter((q) => {
    if (filter === "All") return true;
    if (filter === "Unanswered") return !q.isAnswered;
    if (filter === "Answered") return q.isAnswered;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Questions & Answers</span>
        </h1>
      </div>
      <div className="overflow-x-auto px-6">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Questions & Answers</h1>
            <input
              type="text"
              placeholder="Search questions..."
              className="border rounded-lg px-4 py-2 focus:outline-blue-500"
            />
          </div>

          <div className="flex space-x-4 mb-6">
            {["All", "Unanswered", "Answered"].map((type) => (
              <button
                key={type}
                className={`py-2 px-4 rounded-lg ${
                  filter === type ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex space-x-6">
            <div className="w-1/3 bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Questions</h2>
              {loading ? (
                <p>Loading questions...</p>
              ) : (
                <ul className="space-y-4">
                  {filteredQuestions.map((q) => (
                    <li
                      key={q.id}
                      onClick={() => handleQuestionClick(q)}
                      className="p-4 border rounded-lg cursor-pointer hover:shadow-md bg-blue-100"
                    >
                      <h3 className="font-bold text-sm">{q.product.product_name}</h3>
                      <p className="text-gray-600 text-sm">{q.question_text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-2/3 bg-white shadow-md rounded-lg p-6">
              {selectedQuestion ? (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    {selectedQuestion.product.product_name}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedQuestion.question_text}</p>
                  <button
                    className="mb-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
                    onClick={() => handleViewProduct(selectedQuestion.product.id)}
                  >
                    View Product
                  </button>
                  <textarea
                    className="w-full border rounded-lg p-4 focus:outline-blue-500"
                    placeholder="Write your answer here..."
                    rows="6"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  ></textarea>
                  <button
                    onClick={() => handleReply(selectedQuestion.id)}
                    className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                  >
                    Submit Answer
                  </button>
                </>
              ) : (
                <p className="text-gray-600">Select a question to view details and answer.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <p className="text-gray-600">Details about the selected product go here.</p>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QandaSection;
