import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateShopOrder } from "../../../../redux/ShopOrderSlice";

const CartSection = ({ setCartView, setCartId }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [cartdata, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [couponView, setCouponView] = useState(false);
    const [shippingfee, setShippingfee] = useState(50);
    const [platformfee, setPlatformfee] = useState(20);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderTotal, setOrderTotal] = useState(0);
    const [couponValue, setCouponValue] = useState("");

    const [couponMinOrder, setCouponMinOrder] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);
    const [coupontype, setCouponType] = useState("");

    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("https://127.0.0.1:8000/api/get_cart_data/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setCartData(response.data || []);

            const Price = (response.data || []).reduce((total, item) => {
                return total + (item?.product_item?.sale_price || 0) * (item?.quantity || 0);
            }, 0);
            setTotalPrice(Price);
        } catch (errors) {
            console.error("Error fetching cart data:", errors);
            setError("Failed to load cart data. Please try again.");
            setCartData([]);
        } finally {
            setLoading(false);
        }
    };

    const RemoveProduct = async (id) => {
        try {
            await axios.post(
                `https://127.0.0.1:8000/api/remove_cart_product/${id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            fetchData();
        } catch (errors) {
            console.error("Error removing product:", errors);
            alert("Failed to remove product. Please try again.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let totalValue = 0;
        let TempValue = totalPrice + shippingfee + platformfee;

        if (TempValue >= couponMinOrder) {
            if (coupontype === "fixed") {
                totalValue = TempValue - discountValue;
            } else if (coupontype === "percentage") {
                let discount = TempValue * discountValue / 100;
                totalValue = TempValue - discount;
            }
        } else {
            totalValue = TempValue;
        }

        setOrderTotal(totalValue);
    }, [totalPrice, shippingfee, platformfee, couponMinOrder, discountValue, coupontype]);

    const onHandleSize = async (sizeValue, id) => {
        try {
            await axios.post(
                `https://127.0.0.1:8000/api/cart_size/${id}/`,
                { size: sizeValue.trim() },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            fetchData(); // Refresh cart data after size change
        } catch (err) {
            console.error("Error updating size:", err);
            alert("Failed to update size. Please try again.");
        }
    };

    const handleQuantity = async (e, id) => {
        const quantity = parseInt(e.target.value, 10) || 1;

        try {
            await axios.post(
                `https://127.0.0.1:8000/api/cart_quantity/${id}/`,
                { qnty: quantity },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            fetchData();
        } catch (err) {
            console.error("Error updating quantity:", err);
            alert("Failed to update quantity. Please try again.");
        }
    };

    const ApplyCoupons = async () => {
        if (!couponValue.trim()) {
            alert("Please enter a coupon code");
            return;
        }

        try {
            const response = await axios.post(
                "https://127.0.0.1:8000/api/apply_coupon_code/",
                { couponcode: couponValue.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            setDiscountValue(response.data?.coupon?.discount_value || 0);
            setCouponMinOrder(response.data?.coupon?.minimum_order_amount || 0);
            setCouponType(response.data?.coupon?.discount_type || "");
            setCouponView(false);
        } catch (errors) {
            console.error("Error applying coupon:", errors);
            alert(errors.response?.data?.errors?.non_field_errors?.[0] || "Invalid coupon code");
        }
    };

    const HandleCheckOut = async () => {
        if (cartdata.length === 0) {
            alert("Your cart is empty");
            return;
        }

        try {
            const response = await axios.post(
                "https://127.0.0.1:8000/api/initial_order/",
                {
                    order_total: totalPrice,
                    final_total: orderTotal,
                    discount_amount: discountValue,
                    free_shipping_applied: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            setCartId(response.data?.order_id);
            setCartView("address");
        } catch (errors) {
            console.error("Error during checkout:", errors);
            alert("Failed to proceed to checkout. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-[200px] py-10 text-center">
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-[200px] py-10 text-center text-red-500">
                <p>{error}</p>
                <button 
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="container mx-auto px-[200px] py-10">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h3>
                <p className="text-gray-600 mb-8">
                    You have {cartdata.length} item{cartdata.length !== 1 ? 's' : ''} in your cart.
                </p>

                {cartdata.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">Your cart is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Product Details Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartdata.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center"
                                >
                                    <img
                                        src={
                                            item?.product_item?.images?.[0]?.main_image
                                                ? "https://127.0.0.1:8000" + item.product_item.images[0].main_image
                                                : "/default-product-image.jpg"
                                        }
                                        alt={item?.product_item?.product?.product_name || "Product"}
                                        className="w-24 h-24 rounded-md object-cover border"
                                    />
                                    <div className="flex-1 ml-6">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {item?.product_item?.product?.product_name || "Unknown Product"}
                                        </h2>
                                        <p className="text-gray-600">
                                            Price: <span className="font-bold">${item?.product_item?.sale_price || 0}</span>
                                        </p>
                                        <p className="text-gray-600">
                                            Size: {item?.product_item?.size?.size_name || "Not specified"}
                                        </p>
                                        <p className="text-gray-600">
                                            Quantity: {item?.quantity || 1}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center sm:items-end">
                                        <button
                                            onClick={() => RemoveProduct(item.product_item?.id)}
                                            className="text-red-600 font-semibold text-sm hover:bg-red-600 rounded-md mb-2 p-1 border-1 border-red-600 hover:text-white"
                                        >
                                            <i className="fa-solid fa-circle-xmark p-1"></i>
                                            Remove
                                        </button>
                                        <div className="flex items-center space-x-4">
                                            Size:
                                            <select
                                                value={item?.product_item?.size?.size_name || ""}
                                                onChange={(e) => onHandleSize(e.target.value, item.product_item?.product?.id)}
                                                className="border border-gray-300 rounded-md px-3 py-1"
                                            >
                                                <option value="XS">XS</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                            </select>
                                            Quantity:
                                            <input
                                                onChange={(e) => handleQuantity(e, item.product_item?.product?.id)}
                                                type="number"
                                                min="1"
                                                className="border border-gray-300 rounded-md w-16 px-2 py-1 h-10 text-xl"
                                                value={item?.quantity || 1}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Summary Section */}
                        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 space-y-6">
                            {/* Apply Coupons Section */}
                            <div>
                                <h6 className="text-md font-semibold text-gray-800 flex items-center space-x-2">
                                    <i className="fa-solid fa-tag text-red-500"></i>
                                    <span>Apply Coupons:</span>
                                </h6>
                                {couponView ? (
                                    <div className="mt-4 flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                            value={couponValue}
                                            onChange={(e) => setCouponValue(e.target.value)}
                                        />
                                        <button
                                            onClick={ApplyCoupons}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setCouponView(true)}
                                        className="mt-2 px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition"
                                    >
                                        Apply
                                    </button>
                                )}
                            </div>

                            {/* Price Breakdown Section */}
                            <div className="border-t pt-4 space-y-2 text-gray-600">
                                <div className="flex justify-between">
                                    <span>Total MRP:</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span>-${discountValue.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Fee:</span>
                                    <span>${shippingfee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee:</span>
                                    <span>${platformfee.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="flex justify-between text-gray-800 text-lg font-bold border-t pt-4">
                                <span>Order Total:</span>
                                <span>${orderTotal.toFixed(2)}</span>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={HandleCheckOut}
                                className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                                disabled={cartdata.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSection;