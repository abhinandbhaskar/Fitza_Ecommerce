import React, { useState, useEffect } from "react";
import AdditionalInfo from "../../User/ProductView/ProductViewSections/AdditionalInfo";
import AddReview from "../../User/ProductView/ProductViewSections/AddReview";
import { useSelector } from "react-redux";
import axios from "axios";
import QandAsection from "./ProductViewSections/QandAsection";
import { safe } from "../../../utils/safeAccess";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function ProductView({ product }) {
    const [addInfoToggle, setAddInfoToggle] = useState("addInfo");
    const { accessToken } = useSelector((state) => state.auth);
    const [qnty, setQnty] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [mainImage, setMainImage] = useState(null); // Now managed separately
    const navigate = useNavigate();

    useEffect(() => {
        if (product?.items?.length > 0) {
            const initialItem = product.items[0];
            setSelectedColor(safe(initialItem, "color"));
            setSelectedSize(safe(initialItem, "size"));
            setSelectedItem(initialItem);
            
            // Set initial main image
            if (initialItem?.images?.[0]?.main_image) {
                setMainImage(`https://127.0.0.1:8000${initialItem.images[0].main_image}`);
            }
        }
    }, [product]);

    // Update selected item when color or size changes
    useEffect(() => {
        if (selectedColor && selectedSize) {
            const matchingItem = product?.items?.find(
                (item) => item.color.id === selectedColor.id && item.size.id === selectedSize.id
            );
            if (matchingItem) {
                setSelectedItem(matchingItem);
                // Update main image when item changes
                if (matchingItem?.images?.[0]?.main_image) {
                    setMainImage(`https://127.0.0.1:8000${matchingItem.images[0].main_image}`);
                }
            }
        }
    }, [selectedColor, selectedSize, product?.items]);

    // Handle image selection
    const handleImageSelect = (imageUrl) => {
        setMainImage(imageUrl);
    };

    // Get unique colors from items
    const uniqueColors = [];
    const colorMap = new Map();
    product?.items?.forEach((item) => {
        if (!colorMap.has(item.color.id)) {
            colorMap.set(item.color.id, true);
            uniqueColors.push(item.color);
        }
    });

    // Get available sizes for selected color
    const availableSizes = [];
    const sizeMap = new Map();
    product?.items?.forEach((item) => {
        if (item.color.id === selectedColor?.id && !sizeMap.has(item.size.id)) {
            sizeMap.set(item.size.id, true);
            availableSizes.push(item.size);
        }
    });

    // Handle color selection
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        // Find first available size for this color
        const firstSizeForColor = product?.items?.find((item) => item.color.id === color.id)?.size;
        if (firstSizeForColor) {
            setSelectedSize(firstSizeForColor);
        }
    };

    // Handle size selection
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const AddToCartNow = async (itemId) => {
        const inputData = {
            qnty: parseInt(qnty),
        };

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/add_to_cart/${itemId}/`, inputData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 201) {
                toast.success(response.data.message);
            }
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            toast.error("Error While Add Product to Cart..");
        }
    };

    const BuyNow = (id) => {
        AddToCartNow(id);
        setTimeout(() => {
            navigate("/cartpage");
        }, 2000);
    };

    // Fallback image in case selectedItem or images are not available
    const displayImage = mainImage || "/path/to/default-image.jpg";

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {/* Main Image */}
                    <img 
                        src={displayImage} 
                        alt="Product" 
                        className="w-full rounded-xl shadow-md border border-gray-200 cursor-zoom-in"
                        onClick={() => {
                            // You could implement a full-screen image viewer here
                            // or use a library like react-image-lightbox
                        }}
                    />
                    
                    {/* Thumbnail Gallery */}
                    <div className="flex space-x-4 mt-4">
                        {selectedItem?.images?.[0]?.main_image && (
                            <button 
                                onClick={() => handleImageSelect(`https://127.0.0.1:8000${selectedItem.images[0].main_image}`)}
                                className="focus:outline-none"
                            >
                                <img
                                    src={`https://127.0.0.1:8000${selectedItem.images[0].main_image}`}
                                    alt="Thumbnail 1"
                                    className={`w-24 h-24 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].main_image}` ? 'border-green-600' : 'border-gray-200'}`}
                                />
                            </button>
                        )}
                        {selectedItem?.images?.[0]?.sub_image_1 && (
                            <button 
                                onClick={() => handleImageSelect(`https://127.0.0.1:8000${selectedItem.images[0].sub_image_1}`)}
                                className="focus:outline-none"
                            >
                                <img
                                    src={`https://127.0.0.1:8000${selectedItem.images[0].sub_image_1}`}
                                    alt="Thumbnail 2"
                                    className={`w-24 h-24 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].sub_image_1}` ? 'border-green-600' : 'border-gray-200'}`}
                                />
                            </button>
                        )}
                        {selectedItem?.images?.[0]?.sub_image_2 && (
                            <button 
                                onClick={() => handleImageSelect(`https://127.0.0.1:8000${selectedItem.images[0].sub_image_2}`)}
                                className="focus:outline-none"
                            >
                                <img
                                    src={`https://127.0.0.1:8000${selectedItem.images[0].sub_image_2}`}
                                    alt="Thumbnail 3"
                                    className={`w-24 h-24 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].sub_image_2}` ? 'border-green-600' : 'border-gray-200'}`}
                                />
                            </button>
                        )}
                        {selectedItem?.images?.[0]?.sub_image_3 && (
                            <button 
                                onClick={() => handleImageSelect(`https://127.0.0.1:8000${selectedItem.images[0].sub_image_3}`)}
                                className="focus:outline-none"
                            >
                                <img
                                    src={`https://127.0.0.1:8000${selectedItem.images[0].sub_image_3}`}
                                    alt="Thumbnail 4"
                                    className={`w-24 h-24 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].sub_image_3}` ? 'border-green-600' : 'border-gray-200'}`}
                                />
                            </button>
                        )}
                    </div>
                </div>

                {/* Rest of your product details component remains the same */}
                <div>
                    {/* ... (keep all your existing product details code) ... */}
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="min-h-screen p-8 bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex space-x-4 mb-4">
                        <button
                            className={`px-4 py-2 rounded-lg ${
                                addInfoToggle === "addInfo" ? "bg-green-600 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => setAddInfoToggle("addInfo")}
                        >
                            Additional Info
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${
                                addInfoToggle === "AddReview" ? "bg-green-600 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => setAddInfoToggle("AddReview")}
                        >
                            Add Review
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${
                                addInfoToggle === "QandA" ? "bg-green-600 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => setAddInfoToggle("QandA")}
                        >
                            Q&A
                        </button>
                    </div>

                    {addInfoToggle === "addInfo" && <AdditionalInfo product={product} />}
                    {addInfoToggle === "AddReview" && <AddReview product={product} />}
                    {addInfoToggle === "QandA" && <QandAsection product={product} />}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ProductView;