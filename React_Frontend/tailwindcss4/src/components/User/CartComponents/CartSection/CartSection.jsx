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
    const [couponId,setCouponId]=useState(null);

    const [startPincode, setStartPincode] = useState("");
    const [endPincode, setEndPincode] = useState("");
    const [distance, setDistance] = useState(null);
    const [weight, setWeight] = useState(0);
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
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("https://127.0.0.1:8000/api/get_cart_data/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const cartData = response.data.cartdata || [];
            const postcode = response.data.postcode || "";

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

            console.log("Total Price:", result.totalPrice);
            console.log("Total Discount:", result.totalDiscount);
            CalculatePlatformFee(result.totalPrice);
            setTotalPrice(result.totalPrice);
            setProductDiscount(result.totalDiscount);

            const TotalWeight = cartData.reduce((total, item) => {
                const productItem = item?.product_item?.product?.weight || 0;
                return total + productItem * (item?.quantity || 0);
            }, 0);

            console.log("TotalWeight in grams:", TotalWeight);

            // Calculate shipping fee
            let shippingFee = 0;
            if (TotalWeight > 200) {
                // Calculate how many 200g units are above the free threshold
                const excessWeight = TotalWeight - 200;
                const units = Math.ceil(excessWeight / 200); // Round up to nearest whole number
                shippingFee = units * 5; // ₹5 per 200g unit
            }

            console.log("Shipping Feefffffffffffffff:", shippingFee);

            setWeightFee(shippingFee);
        } catch (errors) {
            console.error("Error fetching cart data:", errors);
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
            setDiscountCard(response.data);
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
            console.log("Freeeeeeeeeeeeeeeeeeeeeeee", response.data[0]);
            console.log("eeeeeeeeeeeeeeeeeeeeeeee", response.data[0].min_order_amount);
            setCheckFeeship(response?.data[0]?.min_order_amount);
        } catch (errors) {
            console.error(errors.response || errors);
            alert("Failed to fetch free shipping offers. Please try again.");
        }
    };

    useEffect(() => {
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
            const fees = response.data.shipping_fee;
            setTravelFee(fees);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (startPincode && endPincode) {
                fetchRoute(); // Move the fetchRoute function outside the useEffect if needed
            }
        }, 100); // Adjust debounce delay as necessary

        return () => clearTimeout(timer); // Cleanup previous timer on dependency change
    }, [startPincode, endPincode]);


    useEffect(() => {
  // Calculate base subtotal after product discounts
  let subtotal = totalPrice - productDiscount;

  // Apply coupon discount first (if any)
  if (coupontype && discountValue) {
    if (coupontype === "fixed") {
      subtotal = Math.max(0, subtotal - discountValue); // Ensure subtotal doesn't go negative
    } else if (coupontype === "percentage") {
      subtotal *= (1 - discountValue / 100);
    }
  }

  // Apply discount card (if any) - should be on product value only
  let discountCardValue = 0;
  if (discountPercentage > 0) {
    discountCardValue = subtotal * (discountPercentage / 100);
    subtotal -= discountCardValue;
  }

  // Calculate platform fee (2% of discounted subtotal)
  const calculatedPlatformFee = subtotal * 0.02;
  setPlatformfee(calculatedPlatformFee);

  // Calculate shipping fee
  let finalShippingFee = 0;
  if (checkFreeShip > subtotal) { // Only apply shipping if order doesn't qualify for free shipping
    finalShippingFee = weightfee + travelfee;
  }

  // Calculate final total
  const finalTotal = subtotal + calculatedPlatformFee + finalShippingFee;

  // Update all states
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
    finalTotal
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
  checkFreeShip
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

            console.log("ppppppppppppppppppppppppppppppppppppppppppppp", response.data?.coupon?.end_date);

            // // Only set coupon values if all conditions are met
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
        
       

        const initialOrderData={
            order_total: totalPrice,
            final_total: orderTotal,
            discount_amount: productDiscount,
            coupon: couponId,
            free_shipping_applied: shippingfee === 0 ? true : false, 
        }
        console.log("JACK",initialOrderData);

        try {
            const response = await axios.post(
                "https://127.0.0.1:8000/api/initial_order/",initialOrderData,
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
            <div className="container mx-auto px-[200px] py-10">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h3>
                <p className="text-gray-600 mb-8">
                    You have {cartdata.length} item{cartdata.length !== 1 ? "s" : ""} in your cart.
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
                                            Description :{" "}
                                            <span className="font-bold">
                                                {" "}
                                                {item?.product_item?.product?.product_description || "Unknown Product"}
                                            </span>
                                        </p>

                                        {item?.product_item?.product?.offers?.[0] &&
                                        new Date(item.product_item.product.offers[0].end_date) > new Date() &&
                                        new Date(item.product_item.product.offers[0].start_date) <= new Date() ? (
                                            <div className="flex items-center">
                                                <span className="text-gray-400 line-through text-sm mr-2">
                                                    ${item?.product_item?.sale_price || 0}
                                                </span>
                                                <span className="text-xl font-sm text-green-600">
                                                    $
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
                                            <p className="text-gray-600">
                                                Price:{" "}
                                                <span className="font-bold"> ₹{item?.product_item?.sale_price || 0}</span>
                                            </p>
                                        )}

                                        <p className="text-gray-600">
                                            Size: {item?.product_item?.size?.size_name || "Not specified"}
                                        </p>
                                        <p className="text-gray-600">Quantity: {item?.quantity || 1}</p>
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
                                            Quantity:
                                            <input
                                                onChange={(e) => handleQuantity(e, item.product_item?.id)}
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

                            {/* discount card */}

                            {discountCard?.length > 0 && carddisplay ? (
                                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                                    <h6 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                        <i className="fa-solid fa-credit-card text-blue-500 text-lg"></i>
                                        <span>Available Discount Cards</span>
                                    </h6>
                                    <div className="space-y-3">
                                        {discountCard
                                            .filter((item) => item.is_active === true)
                                            .map((card, key) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between p-3 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                                    onClick={() => handleDiscountPercentage(card.discount_percentage)}
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
                            ) : null}

                            {/* Price Breakdown Section */}
                            <div className="border-t pt-4 space-y-2 text-gray-600">
                           <div className="flex justify-between">
                            <span>Total MRP:</span>
                            <span>
                                {productDiscount > 0 ? "₹ " + (totalPrice + productDiscount).toFixed(2) : "₹ " + totalPrice.toFixed(2)}
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

                                      

                                        <span> {
                                            discountPercentage>0 && coupontype ? ("₹-"+(totalPrice + productDiscount-discountValue)*discountPercentage/100):("₹-"+(totalPrice + productDiscount)*discountPercentage/100)
                                        } </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Platform Fee (2%) : </span>
                                    <span> ₹ {platformfee.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="flex justify-between text-gray-800 text-lg font-bold border-t pt-4">
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
                )}
            </div>
        </div>
    );
};

export default CartSection;
