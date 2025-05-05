import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";

import {updateShopOrder} from "../../../../redux/ShopOrderSlice";

const CartSection = ({ setCartView,setCartId }) => {
    const { accessToken } = useSelector((state) => state.auth);
    const [cartdata, setCartData] = useState([]);
    const [size, setSize] = useState("");
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
            const response = await axios.get("https://127.0.0.1:8000/api/get_cart_data/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Cart Data", response);
            console.log("Cart Dataaa", response.data);
            setCartData(response.data);

            const cartData = response.data;
            console.log("Cart Data Array: ", cartData);
            cartData.forEach((item, index) => console.log(`Item ${index}: `, item));

            const Price = cartData.reduce((total, item) => {
                return total + item.product_item.sale_price * item.quantity;
            }, 0);
            console.log("Total Price", Price);
            setTotalPrice(Price);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const RemoveProduct = async (id) => {
        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/remove_cart_product/${id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response);
            console.log(response.data);
            fetchData();
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let totalValue = 0;
        let TempValue = totalPrice + shippingfee + platformfee;
        console.log("TempValue", TempValue);
        console.log("CouponMinOrder", couponMinOrder);
        console.log("DiscountValue", discountValue);
        console.log("Discount coupontype", coupontype);

        if (coupontype === "fixed") {
        }

        if (TempValue >= couponMinOrder) {
            if (coupontype === "fixed") {
                totalValue = TempValue - discountValue;
            }
            else if(coupontype === "percentage")
            {
                let discount=TempValue*discountValue/100;
                totalValue = TempValue-discount;
            }
        } else {
            totalValue = TempValue;
        }

        setOrderTotal(totalValue);
    }, [totalPrice, shippingfee, platformfee, couponMinOrder, discountValue, coupontype]);

    const onHandleSize = async (e, id) => {
        setSize(e);
        console.log("BLo", e);
        console.log("ProID", id);

        console.log("CCCC", id);

        const inputData = {
            size: size.trim(),
        };

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/cart_size/${id}/`, inputData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
        }
    };
    const handleQuantity = async (e, id) => {
        const quantity = parseInt(e.target.value, 10);

        console.log("Quantity:", quantity);
        console.log("Product ID:", id);

        const inputData = {
            qnty: quantity,
        };

        try {
            const response = await axios.post(`https://127.0.0.1:8000/api/cart_quantity/${id}/`, inputData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            fetchData();
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
        }
    };

    const ApplyCoupons = async () => {
        setCouponView(false);
        console.log("Coupon code : ", couponValue);
        const data = {
            couponcode: couponValue.trim(),
        };

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/apply_coupon_code/", data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("RES", response);
            console.log("RES", response.data);
            setDiscountValue(response.data.coupon.discount_value);
            setCouponMinOrder(response.data.coupon.minimum_order_amount);
            setCouponType(response.data.coupon.discount_type);
        } catch (errors) {
            console.log("ERRor", errors);
            console.log("ERRor", errors.response.data.errors.non_field_errors[0]);
            alert(errors.response.data.errors.non_field_errors[0]);
        }
    };

    const HandleCheckOut=async()=>{
        setCartView("address")

        const discount=20;
        const shipsts=false;
        const orderData={
            "order_total":totalPrice,
            "final_total":orderTotal, 
            "discount_amount":discount,
            "free_shipping_applied":shipsts,
        }

        try{
            const response=await axios.post("https://127.0.0.1:8000/api/initial_order/",orderData,{
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            console.log(response);
            console.log(response.data);
            const orderId = response.data.order_id;
            console.log("ORGERID",orderId);
            setCartId(orderId);
        }catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }
    }

    return (
        <div>
            {/* Cart Content */}
            <div className="container mx-auto px-[200px] py-10">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h3>
                <p className="text-gray-600 mb-8">You have {cartdata.length} item(s) in your cart.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Product Details Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartdata.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center"
                            >
                                <img
                                    src={"https://127.0.0.1:8000/" + item.product_item.images[0].main_image}
                                    alt={`${item.id} Image`}
                                    className="w-24 h-24 rounded-md object-cover border"
                                />
                                <div className="flex-1 ml-6">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {item.product_item.product.product_name}
                                    </h2>
                                    <p className="text-gray-600">
                                        Price: <span className="font-bold">${item.product_item.sale_price}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Size:
                                        {item.product_item.size.size_name}
                                    </p>
                                    <p className="text-gray-600">
                                        Quantity:
                                        {item.quantity}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center sm:items-end">
                                    <button
                                        onClick={() => RemoveProduct(item.product_item.id)}
                                        className="text-red-600 font-semibold text-sm hover:bg-red-600 rounded-md mb-2 p-1 border-1 border-red-600 hover:text-white"
                                    >
                                        <i class="fa-solid fa-circle-xmark p-1"></i>
                                        Remove
                                    </button>
                                    <div className="flex items-center space-x-4">
                                        Size :{" "}
                                        <select
                                            value={size}
                                            onChange={(e) => onHandleSize(e.target.value, item.product_item.product.id)}
                                            name="size"
                                            className="border border-gray-300 rounded-md px-3 py-1"
                                        >
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                        </select>
                                        Quantity :{" "}
                                        <input
                                            onChange={(e) => handleQuantity(e, item.product_item.product.id)}
                                            type="number"
                                            className="border border-gray-300 rounded-md w-16 px-2 py-1 h-10 text-xl"
                                            placeholder="Qty"
                                            defaultValue={item.quantity}
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
                                        onClick={() => ApplyCoupons()}
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

                        {/* Discount Card Section */}
                        <div className="border-t pt-4">
                            <label htmlFor="discountCard" className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Card Name:
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="discountCard"
                                    type="text"
                                    placeholder="Enter Discount Card"
                                    className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Price Breakdown Section */}
                        <div className="border-t pt-4 space-y-2 text-gray-600">
                            <div className="flex justify-between">
                                <span>Total MRP:</span>
                                <span>{totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount:</span>
                                <span>-$discount</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Fee:</span>
                                <span>₹ {shippingfee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee:</span>
                                <span>₹ {platformfee}</span>
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="flex justify-between text-gray-800 text-lg font-bold border-t pt-4">
                            <span>Order Total:</span>
                            <span>₹ {orderTotal}</span>
                        </div>

                        {/* Checkout Button */} 
                        <button
                            onClick={() =>HandleCheckOut()}
                            className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSection;
