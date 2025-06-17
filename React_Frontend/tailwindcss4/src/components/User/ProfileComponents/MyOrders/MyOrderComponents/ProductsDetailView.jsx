import React, { useEffect, useState } from "react";

const ProductsDetailView = ({ currentView, setCurrentView, setMyOrderView }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (currentView.view === "productdetail") {
            const productData = currentView.data;
            console.log("Vadodara", productData); // Access the product object
            setProduct(productData);
        }
    }, [currentView]);

    return (
        <div className="h-full w-full p-6 flex flex-col bg-gray-50">


            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
                <i className="fa-solid fa-cart-shopping text-4xl text-blue-500"></i>
                <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
            </div>

            {/* Breadcrumb */}
            <div className="py-2 text-gray-600 text-sm">
                  <button 
        className="text-blue-500 hover:text-blue-700 hover:underline"
        onClick={() => {
            setCurrentView("myorders");
            setMyOrderView("myorder");
        }}
    >
        My Order &gt;
    </button>

               {/* <button 
    className="text-blue-500 hover:text-blue-700 hover:underline"
    onClick={() => {
        // setCurrentView("myorders");
        setMyOrderView("details");
    }}
>
    Order Details &gt;
</button> */}
                <span className="font-semibold text-blue-600">Product Details</span>
            </div>

            {/* Product Details Section */}
            {product ? (
                <div className="bg-white rounded-lg shadow p-4 mt-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Product Image */}
                        <img
                            src={`https://127.0.0.1:8000/${product.product_item.product.items[0].images[0].main_image}`}
                            alt={product.product_item.product.product_name}
                            className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg"
                        />

                        {/* Product Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {product.product_item.product.product_name}
                            </h2>
                            <p className="text-gray-600">{product.product_item.product.product_description}</p>
                            <p>
                                <span className="font-semibold">Brand:</span> 
                                {product.product_item.product.brand.brand_name || "Not Available.."}
                            </p>
                            <p>
                                <span className="font-semibold">Size:</span> 
                                {product.product_item.size.size_name || "Not Available.."}
                            </p>
                            <p>
                                <span className="font-semibold">Color:</span> 
                                {product.product_item.color.color_name || "Not Available.."}
                            </p>

                            <p className="mt-2">
                                <span className="font-semibold">Price:</span> {product.price}
                            </p>
                            <p>
                                <span className="font-semibold">Quantity:</span> {product.quantity}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading product details...</p>
            )}

            {/* Seller Section */}
            {product && (
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Shop Details</h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Shop Logo */}
                        <div className="flex-shrink-0">
                            <img
                                src={`https://127.0.0.1:8000/${product.product_item.product.shop.shop_logo}`}
                                alt="Shop Logo"
                                className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-lg border"
                            />
                        </div>

                        {/* Shop Information */}
                        <div className="flex-1">
                            <p className="mb-2">
                                <span className="font-semibold text-gray-700">Shop Name:</span>{" "}
                                <span className="font-bold text-lg text-gray-900">
                                    {product.product_item.product.shop.shop_name}
                                </span>
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold text-gray-700">About:</span>{" "}
                                <span className="text-gray-600">{product.product_item.product.shop.description}</span>
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold text-gray-700">Contact:</span>{" "}
                                <span className="text-gray-600">{product.product_item.product.shop.email}</span>
                            </p>
                        </div>

                        {/* Feedback Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => {
                                    setCurrentView({ view1: "sellerfeedback", sid: product.product_item.product.shop.id });
                                }}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                            >
                                Give Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsDetailView;
