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
    const [mainImage, setMainImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (product?.items?.length > 0) {
            const initialItem = product.items[0];
            setSelectedColor(safe(initialItem, "color"));
            setSelectedSize(safe(initialItem, "size"));
            setSelectedItem(initialItem);

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
                // alert(response.data.message);
                toast.success(response.data.message);
            }
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            toast.error("Error While Add Product to Cart..");
        }
    };

    const BuyNow=(id)=>{
        AddToCartNow(id);
        setTimeout(()=>{
            navigate("/cartpage");
        },2000);
    }

    // Fallback image in case selectedItem or images are not available
    // const mainImage = selectedItem?.images?.[0]?.main_image
    //     ? `https://127.0.0.1:8000${selectedItem.images[0].main_image}`
    //     : "/path/to/default-image.jpg"; // Add a default image path

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
                                    className={`w-34 h-34 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].main_image}` ? 'border-green-600' : 'border-gray-200'}`}
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
                                    className={`w-34 h-34 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].sub_image_1}` ? 'border-green-600' : 'border-gray-200'}`}
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
                                    className={`w-34 h-34 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].sub_image_2}` ? 'border-green-600' : 'border-gray-200'}`}
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
                                    className={`w-34 h-34 rounded-lg shadow-md border-2 ${mainImage === `https://127.0.0.1:8000${selectedItem.images[0].sub_image_3}` ? 'border-green-600' : 'border-gray-200'}`}
                                />
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold">{safe(product, "product_name") || ""}</h2>
                    <h5 className="text-lg mt-2">
                        Brand: <span className="text-green-600 font-bold">{safe(product, "brand.brand_name") || ""}</span>
                    </h5>
                    <hr className="my-4" />
                    <div className="space-y-2">
                        {/* Price display section */}
                        <div className="flex items-baseline gap-3 flex-wrap">
                            {/* Show original sale price with strikethrough when discounted */}
                            {product?.offers?.[0]?.discount_percentage > 0 && (
                                <strike className="text-gray-500 text-lg">₹{selectedItem?.sale_price || "N/A"}</strike>
                            )}

                            {/* Show current price (discounted if offer exists) */}
                            <span className="text-green-600 text-2xl font-semibold">
                                ₹
                                {product?.offers?.[0]?.discount_percentage > 0
                                    ? (
                                          parseFloat(selectedItem?.sale_price) -
                                          (parseFloat(selectedItem?.sale_price) *
                                              parseFloat(product.offers[0].discount_percentage)) /
                                              100
                                      ).toFixed(2)
                                    : selectedItem?.sale_price || "N/A"}
                            </span>

                            {/* Offer badge */}
                            {product?.offers?.[0]?.discount_percentage > 0 && (
                                <span className="text-red-500 text-lg">
                                    {Math.round(parseFloat(product.offers[0].discount_percentage))}% OFF
                                </span>
                            )}
                        </div>

                        {/* Optional offer tag */}
                        {product?.offers?.[0]?.discount_percentage > 0 && (
                            <div className="bg-green-200 text-green-900 px-2 py-1 rounded-md text-sm flex items-center gap-1 w-fit">
                                <i className="fa-solid fa-tag text-sm"></i>
                                <span>Special Offer</span>
                            </div>
                        )}

                        {/* Color display */}
                        {selectedItem?.color && (
                            <div className="text-gray-700">
                                <span>Color: </span>
                                <span className="font-medium">{safe(selectedItem, "color.color_name")}</span>
                            </div>
                        )}
                    </div>

                    {/* Color Selection */}
                    <div className="mt-4">
                        <h4 className="font-semibold">Color:</h4>
                        <div className="flex space-x-2 mt-2">
                            {uniqueColors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => handleColorSelect(color)}
                                    className={`px-4 py-2 border rounded-lg ${
                                        selectedColor?.id === color.id ? "border-green-600 border-2" : ""
                                    }`}
                                >
                                    {safe(color, "color_name")}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="mt-4 text-gray-700">{safe(product, "product_description") || ""}</p>
                    <ul className="mt-4 space-y-2">
                        <li>1 Year {safe(product, "brand.brand_name") || ""} Brand Warranty</li>
                        <li>7 Day Return Policy</li>
                        <li>Cash on Delivery available</li>
                    </ul>

                    {/* Size Selection */}
                    <div className="mt-6">
                        <h4 className="font-semibold">Size:</h4>
                        <div className="flex space-x-4 mt-2">
                            {availableSizes.map((sizeItem) => (
                                <button
                                    key={safe(sizeItem, "id")}
                                    onClick={() => handleSizeSelect(sizeItem)}
                                    className={`px-4 py-2 border rounded-lg ${
                                        selectedSize?.id === sizeItem.id ? "bg-green-600 text-white" : ""
                                    }`}
                                >
                                    {safe(sizeItem, "size_name")}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
    <div className="flex items-center">
        <input
            type="number"
            min="1"
            max={selectedItem?.quantity_in_stock || 10}
            value={qnty}
            onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                const max = selectedItem?.quantity_in_stock || 10;
                setQnty(isNaN(value) ? 1 : Math.max(1, Math.min(max, value)));
            }}
            className="border border-gray-300 rounded-lg p-2 w-24 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Quantity"
        />
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4">
        <button
            onClick={() => AddToCartNow(selectedItem?.id)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
        >
            Add to Cart
        </button>
        
        <button 
            onClick={() => BuyNow(selectedItem?.id)} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
        >
            Buy Now
        </button>
    </div>
</div>

                    <div className="mt-8 border-t pt-6">
                        <h4 className="text-lg font-semibold">Product Details</h4>
                        <table className="mt-4 w-full border-collapse border border-gray-300 text-left">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Brand</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(product, "brand.brand_name") || ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Material</th>
                                    <td className="border border-gray-300 px-4 py-2">{safe(product, "about") || ""}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Color</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(selectedColor, "color_name") || ""}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Size</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(selectedSize, "size_name") || "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Availability</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(selectedItem, "quantity_in_stock") || 0} items In Stock
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Weight</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(product, "weight") || "0.00"}g
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Care Instructions</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(product, "care_instructions") || ""}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
