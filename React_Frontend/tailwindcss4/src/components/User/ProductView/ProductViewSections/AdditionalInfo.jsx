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
            {/* Product Details Section */}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Product Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        {[
                            { label: "Product Category", value: safe(product, 'category.category_name') },
                            { label: "Model height", value: safe(product, 'model_height') },
                            { label: "Model wearing", value: safe(product, 'model_wearing') },
                            { label: "Care Instructions", value: safe(product, 'care_instructions') },
                            { label: "Product Code", value: product?.items?.[0]?.product_code },
                        ].map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-start">
                                <span className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">{item.label}</span>
                                <span className="text-sm text-gray-600 mt-1 sm:mt-0">{item.value || "N/A"}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">About product</span>
                            <p className="text-sm text-gray-600 mt-1">{safe(product, 'about') || "N/A"}</p>
                        </div>
                        
                        {safe(product, 'brand.brand_name') && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">
                                    Brand: {safe(product, 'brand.brand_name')}
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                    {safe(product, 'brand.brand_description') || "No brand description available"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Shop Details Section */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Shop Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Shop Logo and Basic Info */}
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <img 
                                    src={`https://127.0.0.1:8000${product?.shop?.shop_logo}`}
                                    className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                    alt="Shop logo"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = 'https://via.placeholder.com/64';
                                    }}
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-800">{safe(product, 'shop.shop_name')}</h4>
                                {safe(product, 'shop.rating') && (
                                    <div className="mt-1">
                                        {renderRatingStars(safe(product, 'shop.rating'))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Shop Contact Info */}
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Contact Number</span>
                                <p className="text-sm text-gray-600 mt-1">{safe(product, 'shop.contact_number') || "N/A"}</p>
                            </div>
                            
                            <div>
                                <span className="text-sm font-medium text-gray-700">Email</span>
                                <p className="text-sm text-gray-600 mt-1">{safe(product, 'shop.email') || "N/A"}</p>
                            </div>
                            
                            <div>
                                <span className="text-sm font-medium text-gray-700">Address</span>
                                <p className="text-sm text-gray-600 mt-1">{safe(product, 'shop.shop_address') || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Shop Banner */}
                        {product?.shop?.shop_banner && (
                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                    src={`https://127.0.0.1:8000${product?.shop?.shop_banner}`}
                                    className="w-full h-48 object-cover"
                                    alt="Shop banner"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = 'https://via.placeholder.com/800x200';
                                    }}
                                />
                            </div>
                        )}
                        
                        {/* Shop Description */}
                        <div>
                            <span className="text-sm font-medium text-gray-700">About Shop</span>
                            <p className="text-sm text-gray-600 mt-1">
                                {safe(product, 'shop.description') || "No description available"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdditionalInfo;