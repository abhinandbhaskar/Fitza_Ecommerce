import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateShopOrder } from "../../../../redux/ShopOrderSlice";

const CartSection = ({ setCartView, setCartId }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    // State management
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [couponState, setCouponState] = useState({
        view: false,
        code: "",
        minOrder: 0,
        discount: 0,
        type: ""
    });
    const [shippingDetails, setShippingDetails] = useState({
        fee: 0,
        weightFee: 0,
        travelFee: 0,
        startPin: "",
        endPin: ""
    });
    const [discountCard, setDiscountCard] = useState({
        cards: [],
        percentage: 0,
        display: true
    });
    const [checkFreeShip, setCheckFreeShip] = useState(0);

    // Memoized calculations
    const { totalPrice, platformFee } = useMemo(() => {
        const tp = cartData.reduce((total, item) => {
            const productItem = item?.product_item;
            if (!productItem) return total;

            let price = parseFloat(productItem.sale_price) || 0;
            const offer = productItem.product?.offers?.[0];

            if (offer && new Date(offer.end_date) > new Date()) {
                price *= (1 - (parseFloat(offer.discount_percentage) || 0) / 100);
            }

            return total + (price * (item?.quantity || 0));
        }, 0);

        return {
            totalPrice: tp,
            platformFee: tp * 0.02
        };
    }, [cartData]);

    const orderTotal = useMemo(() => {
        let shippingFee = shippingDetails.weightFee + shippingDetails.travelFee;
        let subtotal = totalPrice + platformFee;

        // Apply free shipping
        if (checkFreeShip <= subtotal) {
            shippingFee = 0;
        }

        // Apply coupon discount
        if (couponState.minOrder > 0 && subtotal >= couponState.minOrder) {
            if (couponState.type === "fixed") {
                subtotal -= couponState.discount;
            } else if (couponState.type === "percentage") {
                subtotal *= (1 - couponState.discount / 100);
            }
        }

        // Apply discount card
        if (discountCard.percentage > 0) {
            subtotal *= (1 - discountCard.percentage / 100);
        }

        return (subtotal + shippingFee).toFixed(2);
    }, [totalPrice, platformFee, shippingDetails, couponState, discountCard, checkFreeShip]);

    // Data fetching
    const fetchInitialData = useCallback(async () => {
        try {
            const [cartRes, cardsRes, shippingRes] = await Promise.all([
                axios.get("https://127.0.0.1:8000/api/get_cart_data/", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }),
                axios.get("https://127.0.0.1:8000/api/get_discount_card/", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }),
                axios.get("https://127.0.0.1:8000/api/freeshipping_offer/", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
            ]);

            processCartData(cartRes.data);
            setDiscountCard(prev => ({ ...prev, cards: cardsRes.data }));
            setCheckFreeShip(shippingRes.data[0]?.min_order_amount || 0);
        } catch (error) {
            handleDataError(error);
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    const processCartData = useCallback((data) => {
        const cartItems = data.cartdata || [];
        setCartData(cartItems);

        const postcode = data.postcode || "";
        const destinationPin = cartItems[0]?.product_item?.product?.shop?.user?.addresses?.[0]?.postal_code || "";

        setShippingDetails(prev => ({
            ...prev,
            startPin: postcode,
            endPin: destinationPin
        }));

        // Calculate weight fee
        const totalWeight = cartItems.reduce((sum, item) => {
            const weight = item.product_item?.product?.weight || 0;
            return sum + (weight * item.quantity);
        }, 0);

        const weightFee = totalWeight > 200 ? Math.ceil((totalWeight - 200) / 200) * 5 : 0;
        setShippingDetails(prev => ({ ...prev, weightFee }));
    }, []);

    // API interactions
    const handleCartAction = async (url, method = 'get', data = {}) => {
        try {
            const config = {
                method,
                url,
                headers: { Authorization: `Bearer ${accessToken}` },
                data
            };
            await axios(config);
            await fetchInitialData();
        } catch (error) {
            console.error("Operation failed:", error);
            alert("Operation failed. Please try again.");
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        await handleCartAction(
            `https://127.0.0.1:8000/api/cart_quantity/${productId}/`,
            'post',
            { qnty: quantity }
        );
    };

    const removeProduct = async (productId) => {
        await handleCartAction(
            `https://127.0.0.1:8000/api/remove_cart_product/${productId}/`,
            'post'
        );
    };

    const applyCoupon = async () => {
        if (!couponState.code.trim()) return alert("Please enter coupon code");

        try {
            const response = await axios.post(
                "https://127.0.0.1:8000/api/apply_coupon_code/",
                { couponcode: couponState.code.trim() },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const couponData = response.data?.coupon || {};
            setCouponState(prev => ({
                ...prev,
                minOrder: couponData.minimum_order_amount || 0,
                discount: couponData.discount_value || 0,
                type: couponData.discount_type || "",
                view: false
            }));
        } catch (error) {
            alert(error.response?.data?.errors?.non_field_errors?.[0] || "Invalid coupon");
        }
    };

    // Effects
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const fetchRoute = async () => {
            if (!shippingDetails.startPin || !shippingDetails.endPin) return;

            try {
                const response = await axios.get("https://127.0.0.1:8000/api/route/", {
                    params: {
                        start_pincode: shippingDetails.startPin,
                        end_pincode: shippingDetails.endPin
                    }
                });
                setShippingDetails(prev => ({ ...prev, travelFee: response.data.shipping_fee }));
            } catch (error) {
                console.error("Route error:", error);
            }
        };
        fetchRoute();
    }, [shippingDetails.startPin, shippingDetails.endPin]);

    // UI components
    if (loading) return <LoadingView />;
    if (error) return <ErrorView error={error} retry={fetchInitialData} />;

    return (
        <div className="container mx-auto px-[200px] py-10">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h3>
            
            {cartData.length === 0 ? (
                <EmptyCartView />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cartData.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={removeProduct}
                                onQuantityChange={handleQuantityChange}
                            />
                        ))}
                    </div>

                    <OrderSummary
                        couponState={couponState}
                        setCouponState={setCouponState}
                        discountCard={discountCard}
                        setDiscountCard={setDiscountCard}
                        shippingFee={shippingDetails.fee}
                        platformFee={platformFee}
                        totalPrice={totalPrice}
                        orderTotal={orderTotal}
                        onApplyCoupon={applyCoupon}
                        onCheckout={handleCheckout}
                    />
                </div>
            )}
        </div>
    );
};

// Sub-components
const CartItem = ({ item, onRemove, onQuantityChange }) => {
    const product = item.product_item?.product || {};
    const offer = product.offers?.[0];
    const price = calculateItemPrice(item);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4">
            <img
                src={item.product_item?.images?.[0]?.main_image 
                    ? `https://127.0.0.1:8000${item.product_item.images[0].main_image}`
                    : "/default-product-image.jpg"}
                alt={product.product_name}
                className="w-24 h-24 rounded-md object-cover border"
            />
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                    {product.product_name || "Unknown Product"}
                </h2>
                <p className="text-gray-600">{product.product_description}</p>
                <div className="mt-2">
                    {offer && new Date(offer.end_date) > new Date() ? (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through">
                                ₹{item.product_item.sale_price}
                            </span>
                            <span className="text-green-600">
                                ₹{price.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-600">
                            ₹{item.product_item.sale_price}
                        </span>
                    )}
                </div>
                <div className="mt-2 flex items-center gap-4">
                    <span>Size: {item.product_item.size?.size_name || "N/A"}</span>
                    <div className="flex items-center gap-2">
                        <span>Qty:</span>
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => onQuantityChange(item.product_item.product.id, e.target.value)}
                            className="w-16 px-2 py-1 border rounded"
                        />
                    </div>
                </div>
            </div>
            <button
                onClick={() => onRemove(item.product_item.id)}
                className="text-red-600 hover:text-red-800 self-start sm:self-center"
            >
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    );
};


const OrderSummary = ({ 
    couponState,
    setCouponState,
    discountCard,
    setDiscountCard,
    shippingFee,
    platformFee,
    totalPrice,
    couponDiscount,
    cardDiscount,
    orderTotal,
    onApplyCoupon,
    onCheckout
}) => (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Coupon Section */}
        <div>
            <h6 className="text-md font-semibold text-gray-800 flex items-center space-x-2">
                <i className="fa-solid fa-tag text-red-500"></i>
                <span>Apply Coupons:</span>
            </h6>
            {couponState.view ? (
                <div className="mt-4 flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Enter Coupon Code"
                        className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                        value={couponState.code}
                        onChange={(e) => setCouponState(prev => ({ ...prev, code: e.target.value }))}
                    />
                    <button
                        onClick={onApplyCoupon}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                    >
                        Submit
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setCouponState(prev => ({ ...prev, view: true }))}
                    className="mt-2 px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition"
                >
                    Apply Coupon
                </button>
            )}
        </div>

        {/* Discount Cards */}
        {discountCard.cards?.length > 0 && discountCard.display && (
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                <h6 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <i className="fa-solid fa-credit-card text-blue-500 text-lg"></i>
                    <span>Available Discount Cards</span>
                </h6>
                <div className="space-y-3">
                    {discountCard.cards
                        .filter(item => item.is_active)
                        .map((card) => (
                            <div 
                                key={card.id}
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                onClick={() => {
                                    setDiscountCard(prev => ({
                                        ...prev,
                                        percentage: card.discount_percentage,
                                        display: false
                                    }));
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-percent text-blue-600"></i>
                                    <span className="font-medium text-gray-700">{card.card_name}</span>
                                </div>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                                    {card.discount_percentage}% OFF
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2 text-gray-600">
            <div className="flex justify-between">
                <span>Total MRP:</span>
                <span>₹ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Coupon Discount:</span>
                <span>- ₹ {couponDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Card Discount:</span>
                <span>- ₹ {cardDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>₹ {shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Platform Fee (2%):</span>
                <span>₹ {platformFee.toFixed(2)}</span>
            </div>
        </div>

        {/* Order Total */}
        <div className="flex justify-between text-gray-800 text-lg font-bold border-t pt-4">
            <span>Order Total:</span>
            <span>₹ {orderTotal}</span>
        </div>

        {/* Checkout Button */}
        <button
            onClick={onCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 transition font-semibold"
        >
            Proceed to Checkout
        </button>
    </div>
);


// Helper functions and views (same as previous example)
export default CartSection;

