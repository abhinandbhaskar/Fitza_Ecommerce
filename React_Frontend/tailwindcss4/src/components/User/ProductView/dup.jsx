import React, { useState } from "react";

import AdditionalInfo from "../../User/ProductView/ProductViewSections/AdditionalInfo";
import AddReview from "../../User/ProductView/ProductViewSections/AddReview";
import { useSelector } from "react-redux";
import axios from "axios";
import QandAsection from "./ProductViewSections/QandAsection";
function ProductPage({ product }) {
    const [addInfoToggle, setAddInfoToggle] = useState("addInfo");
    const {accessToken}=useSelector((state)=>state.auth);

    const [size,setSize]=useState("M");
    const [qnty,setQnty]=useState(1);



    const AddToCartNow = async (id) => {
        console.log("CCCC",id);

        const inputData = {
            "size": size.trim(),
            "qnty": parseInt(qnty),
        };

    
        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/add_to_cart/${id}/`, inputData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
    
            if (response.status === 201) {
                alert(response.data.message);
            }
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
        }
    };
    

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={
                            product.items?.[0]?.images?.[0] &&
                            product.items?.[0]?.images?.[0].length > 0 &&
                            `https://127.0.0.1:8000${product.items?.[0]?.images?.[0]?.main_image}`
                        }
                        alt="Product"
                        className="w-full rounded-lg"
                    />
                    <div className="flex space-x-4 mt-4">
                        <img
                            src={
                                product.items?.[0]?.images?.[0] &&
                                product.items?.[0]?.images?.[0].length > 0 &&
                                `https://127.0.0.1:8000${product.items?.[0]?.images?.[0].sub_image_1}`
                            }
                            alt="Product"
                            className="w-24 h-24 rounded-lg"
                        />
                        <img
                            src={
                                product.items?.[0]?.images?.[0] &&
                                product.items?.[0]?.images?.[0].length > 0 &&
                                `https://127.0.0.1:8000${product.items?.[0]?.images?.[0].sub_image_2}`
                            }
                            alt="Product"
                            className="w-24 h-24 rounded-lg"
                        />
                        <img
                            src={
                                product.items?.[0]?.images?.[0] &&
                                product.items?.[0]?.images?.[0].length > 0 &&
                                `https://127.0.0.1:8000${product.items?.[0]?.images?.[0].sub_image_3}`
                            }
                            alt="Product"
                            className="w-24 h-24 rounded-lg"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold">{product?.product_name || ""}</h2>
                    <h5 className="text-lg mt-2">
                        Brand: <span className="text-green-600 font-bold">{product?.brand?.brand_name || ""}</span>
                    </h5>
                    <hr className="my-4" />
                    <h3 className="text-xl font-semibold">
                        <span className="text-green-600 text-2xl">₹ {product?.items[0]?.original_price || ""}</span>{" "}
                        <strike>$200.00</strike> 25% Off
                    </h3>
                    <p className="mt-4 text-gray-700">{product?.product_description || ""}</p>
                    <ul className="mt-4 space-y-2">
                        <li>1 Year AL Jazeera Brand Warranty</li>
                        <li>30 Day Return Policy</li>
                        <li>Cash on Delivery available</li>
                    </ul>
                    <div className="flex space-x-4 mt-6">
                        <button value="M" onClick={(e)=>setSize(e.target.value)} className="px-4 py-2 border rounded-lg">M</button>
                        <button value="L" onClick={(e)=>setSize(e.target.value)} className="px-4 py-2 border rounded-lg">L</button>
                        <button value="XL" onClick={(e)=>setSize(e.target.value)} className="px-4 py-2 border rounded-lg">XL</button>
                        <button value="XXL" onClick={(e)=>setSize(e.target.value)} className="px-4 py-2 border rounded-lg">XXL</button>
                    </div>

                    <div className="mt-6 flex items-center space-x-4">
                        <input type="number" value={qnty} onChange={(e)=>setQnty(e.target.value)} className="border rounded-lg p-2 w-24" placeholder="1" />
                        <button onClick={()=>AddToCartNow(product?.id)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
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
                                    <td className="border border-gray-300 px-4 py-2">{product?.product?.about || ""}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Color</th>
                                    <td className="border border-gray-300 px-4 py-2">{product?.color?.color_name}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Availability</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {product?.quantity_in_stock || ""} items In Stock
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="min-h-screen p-8 bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs for toggling */}
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

                    {/* Conditional rendering */}
                    {/* {addInfoToggle === "addInfo" && <AdditionalInfo product={product} />} */}
                    {/* {addInfoToggle === "AddReview" && <AddReview product={product} />} */}
                    {/* {addInfoToggle === "QandA" && <QandAsection product={product} />} */}
                </div>
            </div>
        </div>
    );
}

export default ProductPage;