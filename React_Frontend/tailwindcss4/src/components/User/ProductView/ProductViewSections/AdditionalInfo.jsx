import React from 'react'
import { useSelector } from "react-redux";
const AdditionalInfo = ({product}) => {
    const {accessToken}=useSelector((state)=>state.auth);
    return (
        <div className="p-4 border border-gray-400 rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <tbody>
                    <tr>
                        <th className="border-b border-gray-400 py-2 px-4">Product Category</th>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.category?.category_name || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Model height</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.product?.model_height || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Model wearing</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.product?.model_wearing || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Care Instructions</td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.product?.care_instructions || ""}
                        </td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">About product</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.product?.about || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Product Code</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.product_code || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Shop</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.shop?.shop_name || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">Shop rating</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.shop?.rating || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">About shop</td>
                        <td className="border-b border-gray-400 py-2 px-4">{product?.shop?.description || ""}</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-400 py-2 px-4">
                            Brand {product?.brand?.brand_name || ""} about product
                        </td>
                        <td className="border-b border-gray-400 py-2 px-4">
                            {product?.brand?.brand_description || ""}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AdditionalInfo
