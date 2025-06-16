import React from 'react'
import { useSelector } from "react-redux";
import { safe } from '../../../../utils/safeAccess';

const AdditionalInfo = ({ product }) => {
    const { accessToken } = useSelector((state) => state.auth);
    
    const renderRatingStars = (rating) => {
        const numericRating = parseFloat(rating) || 0;
        const fullStars = Math.floor(numericRating);
        const hasHalfStar = numericRating % 1 >= 0.5;
        
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <span key={i} className="text-yellow-400 text-lg">★</span>;
                    } else if (i === fullStars && hasHalfStar) {
                        return <span key={i} className="text-yellow-400 text-lg">½</span>;
                    }
                    return <span key={i} className="text-gray-300 text-lg">★</span>;
                })}
                <span className="ml-1 text-sm text-gray-600">({numericRating.toFixed(2)})</span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                        {[
                            { label: "Product Category", value: safe(product, 'category.category_name') },
                            { label: "Model height", value: safe(product, 'model_height') },
                            { label: "Model wearing", value: safe(product, 'model_wearing') },
                            { label: "Care Instructions", value: safe(product, 'care_instructions') },
                            { label: "About product", value: safe(product, 'about') },
                            { label: "Product Code", value: product?.items?.[0]?.product_code },
                            { 
                                label: "Shop", 
                                value: (
                                    <div>
                                        <p>{product?.shop?.shop_name}</p>
                                        {product?.shop?.shop_address && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {safe(product, 'shop.shop_address')}
                                            </p>
                                        )}
                                    </div>
                                ) 
                            },
                            { 
                                label: "Shop Contact", 
                                value: (
                                    <div>
                                        <p>{product?.shop?.contact_number}</p>
                                        {product?.shop?.email && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {safe(product, 'shop.email')}
                                            </p>
                                        )}
                                    </div>
                                ) 
                            },
                            { label: "Shop rating", value: renderRatingStars(safe(product, 'shop.rating')) },
                            { label: "About shop", value: safe(product, 'shop.description') },
                            { 
                                label: `Brand ${safe(product, 'brand.brand_name') || ""} about product`, 
                                value: safe(product, 'brand.brand_description') 
                            },
                            { 
                                label: "Weight", 
                                value: `${safe(product, 'weight') || "0.00"} g` 
                            },
                        ].map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <th className="py-3 px-4 text-sm font-medium text-gray-700 whitespace-nowrap w-1/3">
                                    {item.label}
                                </th>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {item.value || "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdditionalInfo;