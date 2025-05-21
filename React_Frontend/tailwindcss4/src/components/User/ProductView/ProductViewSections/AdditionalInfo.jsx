import React from 'react'
import { useSelector } from "react-redux";

const AdditionalInfo = ({product}) => {
    const {accessToken} = useSelector((state) => state.auth);
    
    return (
        <div className="p-4 border border-gray-400 rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <tbody>
                    <tr>
                        <th className="border-b border-gray-400 py-2 px-4">Product Category</th>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.category?.category_name || "N/A"}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Model height</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.model_height || "N/A"}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Model wearing</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.model_wearing || "N/A"}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Care Instructions</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.care_instructions || "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">About product</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.about || "N/A"}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Product Code</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.items?.[0]?.product_code || "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Shop</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.shop?.shop_name || "N/A"}
                            {product?.shop?.shop_address && (
                                <div className="text-sm text-gray-600">
                                    {product.shop.shop_address}
                                </div>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Shop Contact</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.shop?.contact_number || "N/A"}
                            {product?.shop?.email && (
                                <div className="text-sm text-gray-600">
                                    {product.shop.email}
                                </div>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Shop rating</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.shop?.rating ? `${product.shop.rating}/5` : "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">About shop</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.shop?.description || "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">
                            Brand {product?.brand?.brand_name || ""} about product
                        </td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.brand?.brand_description || "N/A"}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Weight</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.weight || "0.00"} kg
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AdditionalInfo;
