import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const QandaSection = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filter, setFilter] = useState("Unanswered");
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);

  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const[productDetails,setProductDetails]=useState([]);

  
  const fetchAnsweredQuestions = async () => {
    setFilter("Answered")
    setLoading(true);
    try {
      const response = await axios.get(
        "https://127.0.0.1:8000/api/seller/user_view_ansquestions/",
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


  const fetchQuestions = async () => {
    setFilter("Unanswered")
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
    ViewProduct(id);
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
      fetchAnsweredQuestions();
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit the answer.");
    }
  };
  

  const filteredQuestions = questions.filter((q) => {
    if (filter === "Unanswered") return true;
    if (filter === "Answered") return !q.isAnswered;
    return true;
  });



      const ViewProduct=async(id)=>{
      
        console.log("R",id);
    
        try{
          const response=await axios.get(`https://127.0.0.1:8000/api/admin/view_product/${id}/`,{
            headers:{
              Authorization:`Bearer ${accessToken}`,
            }
          });
          console.log("ii",response.data[0])
          setProductDetails(response.data[0])
        }catch(errors)
        {
          console.log(errors);
          console.log(errors.response.data);
        }
    
      }


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
         
          </div>

          <div className="flex space-x-4 mb-6">
         
              <button
                key=""
                className={`py-2 px-4 rounded-lg ${
                  filter === "Unanswered" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => fetchQuestions()}
              >
                Unanswered
              </button>

              <button
              key=""
              className={`py-2 px-4 rounded-lg ${
                filter === "Answered" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => fetchAnsweredQuestions()}
              >
              Answered
              </button>
       
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

                      <span
                      className={`text-xs font-semibold py-1 px-2 rounded-lg mt-2 inline-block ${
                         filter === "Answered"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {filter === "Answered"?"Answered":"Unanswered"}
                    </span>

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
  <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-auto max-h-screen">
      <h2 className="text-xl font-bold mb-4">Product Details</h2>
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
        {/* Header */}
        <div className="w-full bg-white shadow-md py-6 px-8 rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-800">
            <span className="text-indigo-600">Product Details</span>
          </h1>
        </div>

        {/* Product Details */}
        <div className="w-full bg-white shadow-md rounded-lg mt-6 p-6 space-y-6">
          {/* Main Image */}
          <div className="flex flex-col items-center w-full">
            <h2 className="text-lg font-semibold text-gray-700">Main Image</h2>
            <img
              src={
                productDetails.images &&
                productDetails.images.length > 0 &&
                `https://127.0.0.1:8000${productDetails.images[0].main_image}`
              }
              alt="Main Product"
              className="w-48 h-48 object-cover border border-gray-200 rounded-lg mt-4"
            />
          </div>

          {/* Sub Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Sub Images</h3>
            <div className="flex space-x-4 mt-4">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={
                    productDetails.images &&
                    productDetails.images.length > 0 &&
                    `https://127.0.0.1:8000${productDetails.images[0][`sub_image_${i}`]}`
                  }
                  alt={`Sub Image ${i}`}
                  className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Product Name", value: productDetails?.product?.product_name || "" },
              { label: "Product Description", value: productDetails?.product?.product_description || "" },
              { label: "Category", value: productDetails.category?.category_name || "" },
              { label: "Brand", value: productDetails.brand?.brand_name || "" },
              { label: "Shop", value: productDetails.shop?.shop_name || "" },
              { label: "Model Height", value: productDetails.product?.model_height || "" },
              { label: "Model Wearing", value: productDetails.product?.model_wearing || "" },
              { label: "Care Instruction", value: productDetails.product?.care_instructions || "" },
              { label: "About", value: productDetails.product?.about || "" },
              { label: "Color", value: productDetails.color?.color_name || "" },
              { label: "Size", value: productDetails.size?.size_name || "" },
              { label: "Quantity in Stock", value: productDetails?.quantity_in_stock || "" },
              { label: "Original Price", value: productDetails?.original_price || "" },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      </div>

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
