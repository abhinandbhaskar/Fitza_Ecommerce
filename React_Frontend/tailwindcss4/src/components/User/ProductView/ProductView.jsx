import React, { useState, useEffect } from "react";
import AdditionalInfo from "../../User/ProductView/ProductViewSections/AdditionalInfo";
import AddReview from "../../User/ProductView/ProductViewSections/AddReview";
import { useSelector } from "react-redux";
import axios from "axios";
import QandAsection from "./ProductViewSections/QandAsection";

function ProductView({ product }) {
    const [addInfoToggle, setAddInfoToggle] = useState("addInfo");
    const { accessToken } = useSelector((state) => state.auth);
    const [qnty, setQnty] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (product?.items?.length > 0) {
            const initialItem = product.items[0];
            setSelectedColor(initialItem.color);
            setSelectedSize(initialItem.size);
            setSelectedItem(initialItem);
        }
    }, [product]);

    // Update selected item when color or size changes
    useEffect(() => {
        if (selectedColor && selectedSize) {
            const matchingItem = product?.items?.find(item => 
                item.color.id === selectedColor.id && 
                item.size.id === selectedSize.id
            );
            if (matchingItem) {
                setSelectedItem(matchingItem);
            }
        }
    }, [selectedColor, selectedSize, product?.items]);

    // Get unique colors from items
    const uniqueColors = [];
    const colorMap = new Map();
    product?.items?.forEach(item => {
        if (!colorMap.has(item.color.id)) {
            colorMap.set(item.color.id, true);
            uniqueColors.push(item.color);
        }
    });

    // Get available sizes for selected color
    const availableSizes = [];
    const sizeMap = new Map();
    product?.items?.forEach(item => {
        if (item.color.id === selectedColor?.id && !sizeMap.has(item.size.id)) {
            sizeMap.set(item.size.id, true);
            availableSizes.push(item.size);
        }
    });

    // Handle color selection
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        // Find first available size for this color
        const firstSizeForColor = product?.items?.find(item => 
            item.color.id === color.id
        )?.size;
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
            "qnty": parseInt(qnty),
        };

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/add_to_cart/${itemId}/`, inputData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            
            if (response.status === 201) {
                alert(response.data.message);
            }
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
        }
    };

    // Fallback image in case selectedItem or images are not available
    const mainImage = selectedItem?.images?.[0]?.main_image 
        ? `https://127.0.0.1:8000${selectedItem.images[0].main_image}`
        : '/path/to/default-image.jpg'; // Add a default image path

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={mainImage}
                        alt="Product"
                        className="w-full rounded-lg"
                    />
                    <div className="flex space-x-4 mt-4">
                        {selectedItem?.images?.[0]?.sub_image_1 && (
                            <img
                                src={`https://127.0.0.1:8000${selectedItem.images[0].sub_image_1}`}
                                alt="Product"
                                className="w-24 h-24 rounded-lg"
                            />
                        )}
                        {selectedItem?.images?.[0]?.sub_image_2 && (
                            <img
                                src={`https://127.0.0.1:8000${selectedItem.images[0].sub_image_2}`}
                                alt="Product"
                                className="w-24 h-24 rounded-lg"
                            />
                        )}
                        {selectedItem?.images?.[0]?.sub_image_3 && (
                            <img
                                src={`https://127.0.0.1:8000${selectedItem.images[0].sub_image_3}`}
                                alt="Product"
                                className="w-24 h-24 rounded-lg"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold">{product?.product_name || ""}</h2>
                    <h5 className="text-lg mt-2">
                        Brand: <span className="text-green-600 font-bold">{product?.brand?.brand_name || ""}</span>
                    </h5>
                    <hr className="my-4" />
                    <div className="space-y-2">
  {/* Price display section */}
  <div className="flex items-baseline gap-3 flex-wrap">
    {/* Show original sale price with strikethrough when discounted */}
    {product?.offers?.[0]?.discount_percentage > 0 && (
      <strike className="text-gray-500 text-lg">
        ₹{selectedItem?.sale_price || "N/A"}
      </strike>
    )}
    
    {/* Show current price (discounted if offer exists) */}
    <span className="text-green-600 text-2xl font-semibold">
      ₹{product?.offers?.[0]?.discount_percentage > 0
        ? (
            parseFloat(selectedItem?.sale_price) - 
            (parseFloat(selectedItem?.sale_price) * 
             parseFloat(product.offers[0].discount_percentage)/100)
          ).toFixed(2)
        : selectedItem?.sale_price || "N/A"
      }
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
      <span className="font-medium">{selectedItem.color.color_name}</span>
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
                                        selectedColor?.id === color.id ? 'border-green-600 border-2' : ''
                                    }`}
                                >
                                    {color.color_name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <p className="mt-4 text-gray-700">{product?.product_description || ""}</p>
                    <ul className="mt-4 space-y-2">
                        <li>1 Year {product?.brand?.brand_name || ''} Brand Warranty</li>
                        <li>30 Day Return Policy</li>
                        <li>Cash on Delivery available</li>
                    </ul>
                    
                    {/* Size Selection */}
                    <div className="mt-6">
                        <h4 className="font-semibold">Size:</h4>
                        <div className="flex space-x-4 mt-2">
                            {availableSizes.map((sizeItem) => (
                                <button
                                    key={sizeItem.id}
                                    onClick={() => handleSizeSelect(sizeItem)}
                                    className={`px-4 py-2 border rounded-lg ${
                                        selectedSize?.id === sizeItem.id ? 'bg-green-600 text-white' : ''
                                    }`}
                                >
                                    {sizeItem.size_name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center space-x-4">
                        <input
                            type="number"
                            min="1"
                            max={selectedItem?.quantity_in_stock || 10}
                            value={qnty}
                            onChange={(e) => setQnty(Math.max(1, Math.min(selectedItem?.quantity_in_stock || 10, e.target.value)))}
                            className="border rounded-lg p-2 w-24"
                        />
                        <button 
                            onClick={() => AddToCartNow(selectedItem?.id)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Add to Cart
                        </button>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            Buy Now
                        </button>
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h4 className="text-lg font-semibold">Product Details</h4>
                        <table className="mt-4 w-full border-collapse border border-gray-300 text-left">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Brand</th>
                                    <td className="border border-gray-300 px-4 py-2">{product?.brand?.brand_name || ""}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Material</th>
                                    <td className="border border-gray-300 px-4 py-2">{product?.about || ""}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Color</th>
                                    <td className="border border-gray-300 px-4 py-2">{selectedColor?.color_name || ""}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Size</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {selectedSize?.size_name || "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Availability</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {selectedItem?.quantity_in_stock || 0} items In Stock
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Weight</th>
                                    <td className="border border-gray-300 px-4 py-2">{product?.weight || "0.00"} kg</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Care Instructions</th>
                                    <td className="border border-gray-300 px-4 py-2">{product?.care_instructions || ""}</td>
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
        </div>
    );
}

export default ProductView;
