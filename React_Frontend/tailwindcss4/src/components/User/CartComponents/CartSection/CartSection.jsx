import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateShopOrder } from "../../../../redux/ShopOrderSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { safe } from "../../../../utils/safeAccess";

const CartSection = ({ setCartView, setCartId, setCartCount, setSection }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [cartdata, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [couponView, setCouponView] = useState(false);
    const [shippingfee, setShippingfee] = useState(0);
    const [platformfee, setPlatformfee] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderTotal, setOrderTotal] = useState(0);
    const [couponValue, setCouponValue] = useState("");
    const [couponMinOrder, setCouponMinOrder] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);
    const [coupontype, setCouponType] = useState("");
    const [expiredate, setExpireDate] = useState("");
    const [productDiscount, setProductDiscount] = useState(0);
    const [couponId, setCouponId] = useState(null);

    const [startPincode, setStartPincode] = useState("");
    const [endPincode, setEndPincode] = useState("");
    const [weightfee, setWeightFee] = useState(0);
    const [travelfee, setTravelFee] = useState(0);
    const [carddisplay, setCardDisplay] = useState(true);
    const [discountCard, setDiscountCard] = useState([]);

    const [discountPercentage, setDiscountPercentage] = useState(0);

    const [checkFreeShip, setCheckFeeship] = useState(0);

    const dispatch = useDispatch();

    const CalculatePlatformFee = (Price) => {
        const fee = Price * 0.02;
        setPlatformfee(fee);
    };

    const fetchData = async () => {
        if (!accessToken || accessToken.length === 0) {
            toast.error("You need to login first!");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("https://127.0.0.1:8000/api/get_cart_data/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const cartData = safe(response, "data.cartdata") || [];
            const cart_count = response.data.cartdata.length;
            setCartCount(cart_count);
            const postcode = safe(response, "data.postcode") || "";

            setCartData(cartData);
            console.log("Cart Data:", cartData);
            console.log(" Start Postcode:", postcode);
            setStartPincode(postcode);
            console.log(" Destination Postcode:", cartData[0].product_item.product.shop.user.addresses[0].postal_code);
            const desinationpin = cartData[0].product_item.product.shop.user.addresses[0].postal_code;
            setEndPincode(desinationpin);

            const result = cartData.reduce(
                (totals, item) => {
                    const productItem = item?.product_item;
                    if (!productItem) return totals;

                    const originalPrice = parseFloat(productItem.sale_price) || 0;
                    let itemPrice = originalPrice;
                    let discountAmount = 0;

                    if (productItem.product?.offers?.length > 0) {
                        const offer = productItem.product.offers[0];
                        const now = new Date();
                        const startDate = new Date(offer.start_date);
                        const endDate = new Date(offer.end_date);

                        if (now >= startDate && now <= endDate) {
                            const discountPercentage = parseFloat(offer.discount_percentage) || 0;
                           
                            itemPrice = originalPrice * (1 - discountPercentage / 100);
                            discountAmount = originalPrice - itemPrice; // Calculate discount per item
                        }
                    }

                    const quantity = item?.quantity || 0;
                    return {
                        totalPrice: totals.totalPrice + itemPrice * quantity, // Accumulate discounted price
                        totalDiscount: totals.totalDiscount + discountAmount * quantity, // Accumulate discount amount
                    };
                },
                { totalPrice: 0, totalDiscount: 0 }
            );

            console.log("Total Price:", safe(result, "totalPrice"));
            console.log("Total Discount:", safe(result, "totalDiscount"));
            CalculatePlatformFee(safe(result, "totalPrice"));
            setTotalPrice(safe(result, "totalPrice"));
            setProductDiscount(safe(result, "totalDiscount"));

            const TotalWeight = cartData.reduce((total, item) => {
                const productItem = item?.product_item?.product?.weight || 0;
                return total + productItem * (item?.quantity || 0);
            }, 0);

            console.log("TotalWeight in grams:", TotalWeight);

            let shippingFee = 0;
            if (TotalWeight > 200) {
                const excessWeight = TotalWeight - 200;
                const units = Math.ceil(excessWeight / 200); 
                shippingFee = units * 5; 
            }

            console.log("Shipping Feefffffffffffffff:", shippingFee);

            setWeightFee(shippingFee);
        } catch (errors) {
            console.error("Error fetching cart data:", errors);
            toast.error("Billing and shipping addresses are required in your profile before adding items to the cart.");
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

    const fetchDiscoundCard = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/get_discount_card/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log("++++++++++++++++++++++++", response.data);
            setDiscountCard(safe(response, "data"));
        } catch (errors) {
            console.log(errors);
            console.log(errors.response);
        }
    };

    const fetchFetchFreeShip = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/freeshipping_offer/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
       
            setCheckFeeship(response?.data[0]?.min_order_amount || {});
        } catch (errors) {
            console.error(errors.response || errors);
        }
    };

    useEffect(() => {
        setSection("cart");
        fetchData();
        fetchDiscoundCard();
        fetchFetchFreeShip();
    }, []);

    const fetchRoute = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/route/", {
                params: {
                    start_pincode: startPincode,
                    end_pincode: endPincode,
                },
            });
            console.log("Roooot KMMMMMM", response.data);
            console.log("Route data Shipfee: ", response.data.shipping_fee);
            const fees = safe(response, "data.shipping_fee");
            setTravelFee(fees);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (startPincode && endPincode) {
                fetchRoute();
            }
        }, 100);

        return () => clearTimeout(timer); 
    }, [startPincode, endPincode]);

    useEffect(() => {
       
        let subtotal = totalPrice;

      
        if (coupontype && discountValue) {
            if (coupontype === "fixed") {
                subtotal = Math.max(0, subtotal - discountValue); 
            } else if (coupontype === "percentage") {
                subtotal *= 1 - discountValue / 100;
            }
        }

        let discountCardValue = 0;
        if (discountPercentage > 0) {
            let TotalAmount = totalPrice + productDiscount;
            discountCardValue = TotalAmount * (discountPercentage / 100);
            subtotal -= discountCardValue;
        }

        const calculatedPlatformFee = subtotal * 0.02;
        setPlatformfee(calculatedPlatformFee);

        let finalShippingFee = 0;
        if (checkFreeShip > subtotal) {
            finalShippingFee = weightfee + travelfee;
        }

        // Calculate final total
        const finalTotal = subtotal + calculatedPlatformFee + finalShippingFee;

        setShippingfee(finalShippingFee);
        setOrderTotal(finalTotal);

        console.log("Calculation Breakdown:", {
            originalPrice: totalPrice,
            productDiscount,
            afterProductDiscount: totalPrice - productDiscount,
            afterCoupon: subtotal + discountCardValue, // Show value before card discount
            discountCardValue,
            afterDiscountCard: subtotal,
            platformFee: calculatedPlatformFee,
            shippingFee: finalShippingFee,
            finalTotal,
        });
    }, [
        totalPrice,
        productDiscount,
        weightfee,
        travelfee,
        couponMinOrder,
        discountValue,
        coupontype,
        discountPercentage,
        checkFreeShip,
    ]);

    const handleQuantity = async (e, id) => {
        const quantity = parseInt(e.target.value);
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
        } finally {
            console.log("Completed....");
        }
    };

    const increaseQuantity = (productId) => {
        const item = cartdata.find((item) => item.product_item?.id === productId);
        if (item) {
            const newQuantity = (item.quantity || 1) + 1;
            handleQuantity({ target: { value: newQuantity } }, productId);
        }
    };

    const decreaseQuantity = (productId) => {
        const item = cartdata.find((item) => item.product_item?.id === productId);
        if (item) {
            const newQuantity = Math.max(1, (item.quantity || 1) - 1);
            handleQuantity({ target: { value: newQuantity } }, productId);
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

            const currentTotal = totalPrice + shippingfee + platformfee;

            if (new Date(response.data?.coupon?.end_date) <= new Date()) {
                alert("This coupon has expired");
                return;
            }

            if (
                response.data?.coupon?.minimum_order_amount > 0 &&
                currentTotal < response.data?.coupon?.minimum_order_amount
            ) {
                alert(`Minimum order amount for this coupon is ${response.data?.coupon?.minimum_order_amount}`);
                return;
            }


            const discount = response.data?.coupon?.discount_value;
            setDiscountValue(discount);
            setCouponMinOrder(response.data?.coupon?.minimum_order_amount || 0);
            const type = response.data?.coupon?.discount_type;
            setCouponType(type);
            setExpireDate(response.data?.coupon?.end_date || "");
            setCouponId(response.data?.coupon?.id);
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

        if (!totalPrice || !orderTotal || !accessToken) {
            alert("Missing essential order information. Please try again.");
            return;
        }

        dispatch(
            updateShopOrder({
                totalmrp: totalPrice,
                productdiscount: productDiscount,
                shippingfee: shippingfee,
                platformfee: platformfee,
                couponapplied: discountValue,
                discountcard: discountPercentage,
                orderTotal: orderTotal,
            })
        );

        const conditionalDiscount =
            discountPercentage > 0 && coupontype
                ? ((totalPrice + productDiscount) * discountPercentage) / 100
                : ((totalPrice + productDiscount) * discountPercentage) / 100;

        let Total = productDiscount > 0 ? (totalPrice + productDiscount).toFixed(2) : totalPrice.toFixed(2);
        const initialOrderData = {
            order_total: Total,
            final_total: orderTotal.toFixed(2),
            discount_amount: (productDiscount + conditionalDiscount).toFixed(2),
            coupon: couponId,
            free_shipping_applied: shippingfee === 0 ? true : false,
        };
        console.log("JACK", initialOrderData);

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/initial_order/", initialOrderData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setCartId(response.data?.order_id);

            toast.success("Proceeding to the address page. Please confirm.");
            setTimeout(() => {
                setCartView("address");
            }, 2000);
        } catch (errors) {
            console.error("Error during checkout:", errors);
            toast.error("Failed to proceed to checkout. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <p className="mb-5 text-gray-700 font-medium text-lg animate-pulse">Loading your cart...</p>
                <div role="status" aria-label="Loading" className="flex justify-center">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-[3.5px] border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-[3.5px] border-transparent border-t-red-500 rounded-full animate-[spin_0.8s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-10 text-center text-red-500">
                <p>{error}</p>
                <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Retry
                </button>
            </div>
        );
    }

    const handleDiscountPercentage = (discountprctg) => {
        setCardDisplay(false);
        console.log("dis", discountprctg);
        setDiscountPercentage(discountprctg);
    };

    return (
        <div>
            <div className="container mx-auto px-4 sm:px-6 py-6 md:py-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">My Cart</h3>
                <p className="text-gray-600 mb-6 md:mb-8">
                    You have {cartdata.length} item{cartdata.length !== 1 ? "s" : ""} in your cart.
                </p>

                {cartdata.length === 0 ? (
                    <div className="text-gray-600 mb-6 md:mb-8">
                        <p className="text-gray-600 mb-6 md:mb-8">Your cart is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                        {/* Product Details Section */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                            {cartdata.map((item) => (
                                <div
                                    key={safe(item, "id")}
                                    className="bg-white shadow-sm md:shadow-md rounded-lg p-4 md:p-6 flex flex-col sm:flex-row items-center"
                                >
                                    <img
                                        src={
                                            item?.product_item?.images?.[0]?.main_image
                                                ? "https://127.0.0.1:8000" + item.product_item.images[0].main_image
                                                : "/default-product-image.jpg"
                                        }
                                        alt={item?.product_item?.product?.product_name || "Product"}
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover border"
                                    />
                                    <div className="flex-1 ml-0 sm:ml-4 md:ml-6 mt-3 sm:mt-0">
                                        <h2 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
                                            {item?.product_item?.product?.product_name || "Unknown Product"}
                                        </h2>
                                        <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                                            {item?.product_item?.product?.product_description?.substring(0, 70) + "..."}
                                        </p>

                                        {item?.product_item?.product?.offers?.[0] &&
                                        new Date(item.product_item.product.offers[0].end_date) > new Date() &&
                                        new Date(item.product_item.product.offers[0].start_date) <= new Date() ? (
                                            <div className="flex items-center mt-1">
                                                <span className="text-gray-400 line-through text-sm mr-2">
                                                    ₹{item?.product_item?.sale_price || 0}
                                                </span>
                                                <span className="text-base md:text-lg font-sm text-green-600">
                                                    ₹
                                                    {(
                                                        parseFloat(item?.product_item?.sale_price || 0) *
                                                        (1 -
                                                            parseFloat(
                                                                item?.product_item?.product.offers[0].discount_percentage ||
                                                                    0
                                                            ) /
                                                                100)
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-sm md:text-base mt-1">
                                                Price:{" "}
                                                <span className="font-bold"> ₹{item?.product_item?.sale_price || 0}</span>
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                            <p className="text-sm text-gray-600">
                                                Size: {item?.product_item?.size?.size_name || "Not specified"}
                                            </p>
                                            <p className="text-sm text-gray-600">Qty: {item?.quantity || 1}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center sm:items-end mt-3 sm:mt-0 w-full sm:w-auto">
                                        <button
                                            onClick={() => RemoveProduct(item.product_item?.id)}
                                            className="text-red-600 font-semibold text-xs md:text-sm hover:bg-red-600 rounded mb-2 p-1 border border-red-600 hover:text-white w-full sm:w-auto text-center"
                                        >
                                            <i className="fa-solid fa-circle-xmark p-1"></i>
                                            Remove
                                        </button>
                                        <div className="flex items-center justify-between w-full sm:w-auto space-x-2">
                                            <button
                                                onClick={() => {
                                                    const newQuantity = Math.max(1, (item?.quantity || 1) - 1);
                                                    handleQuantity(
                                                        { target: { value: newQuantity } },
                                                        item.product_item?.id
                                                    );
                                                }}
                                                className="bg-gray-200 rounded-md w-8 h-8 md:h-10 flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <input
                                                onChange={(e) => handleQuantity(e, item.product_item?.id)}
                                                type="number"
                                                min="1"
                                                className="border border-gray-300 rounded-md w-14 md:w-16 px-2 py-1 h-8 md:h-10 text-sm md:text-base text-center"
                                                value={item?.quantity || 1}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newQuantity = (item?.quantity || 1) + 1;
                                                    handleQuantity(
                                                        { target: { value: newQuantity } },
                                                        item.product_item?.id
                                                    );
                                                }}
                                                className="bg-gray-200 rounded-md w-8 h-8 md:h-10 flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Summary Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 space-y-4 sticky top-4">
                                {/* Apply Coupons Section */}
                                <div>
                                    <h6 className="text-sm md:text-base font-semibold text-gray-800 flex items-center space-x-2">
                                        <i className="fa-solid fa-tag text-red-500"></i>
                                        <span>Apply Coupons:</span>
                                    </h6>
                                    {couponView ? (
                                        <div className="mt-3 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                            <input
                                                type="text"
                                                placeholder="Enter Coupon Code"
                                                className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 w-full"
                                                value={couponValue}
                                                onChange={(e) => setCouponValue(e.target.value)}
                                            />
                                            <button
                                                onClick={ApplyCoupons}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition w-full sm:w-auto"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setCouponView(true)}
                                            className="mt-2 px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition text-sm"
                                        >
                                            Apply Coupon
                                        </button>
                                    )}
                                </div>

                                {/* discount card */}

                                {discountCard?.length > 0 && carddisplay ? (
                                    <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                                        <h6 className="text-sm md:text-base font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                                            <i className="fa-solid fa-credit-card text-blue-500"></i>
                                            <span>Available Discount Cards</span>
                                        </h6>
                                        <div className="space-y-2">
                                            {discountCard
                                                .filter((item) => item.is_active === true)
                                                .map((card, key) => (
                                                    <div
                                                        key={key}
                                                        className="flex items-center justify-between p-2 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                                        onClick={() => handleDiscountPercentage(card.discount_percentage)}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <i className="fa-solid fa-percent text-blue-600 text-sm"></i>
                                                            <span className="font-medium text-gray-700 text-sm">
                                                                {safe(card, "card_name")}
                                                            </span>
                                                        </div>
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                                                            {safe(card, "discount_percentage")}% OFF
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ) : null}

                                {/* Price Breakdown Section */}
                                <div className="border-t pt-3 space-y-2 text-gray-600 text-sm md:text-base">
                                    <div className="flex justify-between">
                                        <span>Total MRP:</span>
                                        <span>
                                            {productDiscount > 0
                                                ? "₹ " + (totalPrice + productDiscount).toFixed(2)
                                                : "₹ " + totalPrice.toFixed(2)}
                                            {/* {productDiscount > 0 ? "₹ " + (totalPrice).toFixed(2) : "₹ " + totalPrice.toFixed(2)} */}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Product Discount:</span>
                                        {/* productDiscount */}
                                        <span>- ₹ {productDiscount} </span>
                                        {/* <span>- ₹ {discountValue} </span> */}
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping Fee:</span>
                                        {shippingfee === 0 ? <span>Free</span> : <span> ₹ {shippingfee.toFixed(2)}</span>}
                                    </div>

                                    <div className="flex justify-between">
                                        {coupontype === "fixed" && (
                                            <>
                                                <span>Coupon Applied </span>
                                                <span> ₹ -{discountValue} </span>
                                            </>
                                        )}
                                        {coupontype === "percentage" && (
                                            <>
                                                <span>Coupon Applied </span>
                                                <span> {discountValue} %</span>
                                            </>
                                        )}
                                    </div>

                                    {discountPercentage > 0 && (
                                        <div className="flex justify-between">
                                            <span>Discount Card :({discountPercentage} %)</span>

                                            <span>
                                                {" "}
                                                {discountPercentage > 0 && coupontype
                                                    ? "₹-" + ((totalPrice + productDiscount) * discountPercentage) / 100
                                                    : "₹-" +
                                                      ((totalPrice + productDiscount) * discountPercentage) / 100}{" "}
                                            </span>

                                            {/* <span> {
                                            discountPercentage>0 && coupontype ? ("₹-"+(totalPrice + productDiscount-discountValue)*discountPercentage/100):("₹-"+(totalPrice + productDiscount)*discountPercentage/100)
                                        } </span> */}
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Platform Fee (2%) : </span>
                                        <span> ₹ {platformfee.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Order Total */}
                                <div className="flex justify-between text-gray-800 text-base md:text-lg font-bold border-t pt-3">
                                    <span>Order Total:</span>
                                    <span> ₹ {orderTotal.toFixed(2)}</span>
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
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default CartSection;
