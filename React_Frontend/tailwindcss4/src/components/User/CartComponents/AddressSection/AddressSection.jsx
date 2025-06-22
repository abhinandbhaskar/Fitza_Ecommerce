import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { data } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from "../../../../utils/safeAccess";

const AddressSection = ({ setCartView, cartId, setSection }) => {
    const [view, setView] = useState("ship");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [country, setCountry] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [mobile, setMobile] = useState("");
    const { accessToken } = useSelector((state) => state.auth);
    const shopOrder = useSelector((state) => state.shoporder.order);
    const [proceed, setProceed] = useState(false);

    const fetchBillingAddress = async () => {
        setFirstName("");
        setLastName("");
        setAddress1("");
        setAddress2("");
        setCountry("");
        setZipcode("");
        setCity("");
        setState("");
        setMobile("");

        try {
            const response = await fetch("https://127.0.0.1:8000/api/getBillingAddress/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setFirstName(safe(data,'user.first_name') || "");
                setLastName(safe(data,'user.last_name') || "");
                setAddress1(safe(data,'address_line1') || "");
                setAddress2(safe(data,'address_line2') || "");
                setCountry(safe(data,'country') || "");
                setZipcode(safe(data,'postal_code') || "");
                setCity(safe(data,'city') || "");
                setState(safe(data,'state') || "");
                setMobile(safe(data,'phone') || "");
            }
        } catch (errors) {
            console.log("Errors", errors);
        }
    };

    const fetchShippingAddress = async () => {
        setFirstName("");
        setLastName("");
        setAddress1("");
        setAddress2("");
        setCountry("");
        setZipcode("");
        setCity("");
        setState("");
        setMobile("");

        try {
            const response = await fetch("https://127.0.0.1:8000/api/getShippingAddress/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setFirstName(safe(data.user,'first_name') || "");
                setLastName(safe(data,'user.last_name') || "");
                setAddress1(safe(data,'address_line1') || "");
                setAddress2(safe(data,'address_line2') || "");
                setCountry(safe(data,'country') || "");
                setZipcode(safe(data,'postal_code') || "");
                setCity(safe(data,'city') || "");
                setState(safe(data,'state') || "");
                setMobile(safe(data,'phone') || "");

                const hasRequiredFields = Boolean(
                    data.user?.first_name?.trim() &&
                        data.user?.last_name?.trim() &&
                        data.postal_code?.trim() &&
                        data.country?.trim() &&
                        data.phone?.trim()
                );
                setProceed(hasRequiredFields);
            }
        } catch (errors) {
            console.log("Errors", errors);
        }
    };

    const handleShipping = async () => {
        setView("ship");
        fetchShippingAddress();
    };

    const handleBilling = async () => {
        setView("billing");
        fetchBillingAddress();
    };

    useEffect(() => {
        setSection("address");
        fetchShippingAddress();
    }, []);

    const handleBillingAddress = async (e) => {
        e.preventDefault();
        const billingAddressData = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            address1: address1.trim(),
            address2: address2.trim(),
            country: country.trim(),
            zipcode: zipcode.trim(),
            city: city.trim(),
            state: state.trim(),
            mobile: mobile.trim(),
        };

        try {
            const response = await axios.post("https://127.0.0.1:8000/api/AddBillingAddess/", billingAddressData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            toast.success(response.data.message);
            setView("ship");
        } catch (errors) {
            console.log("errors", errors);
            toast.error("Failed to save billing address");
        }
    };

    const handleShippingAddress = async (e) => {
        e.preventDefault();
        const shippingAddressData = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            address1: address1.trim(),
            address2: address2.trim(),
            country: country.trim(),
            zipcode: zipcode.trim(),
            city: city.trim(),
            state: state.trim(),
            mobile: mobile.trim(),
        };
        
        try {
            const response = await axios.post("https://127.0.0.1:8000/api/AddShippingAddess/", shippingAddressData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (proceed === true) {
                toast.success("Proceeding to the payment page. Please confirm.");
                setTimeout(() => {
                    setCartView("payment");
                }, 2000);
            } else {
                toast.success("Shipping address saved successfully");
                setProceed(true);
            }
        } catch (errors) {
            console.log("errors", errors);
            toast.error("Error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-4 p-4 lg:px-[200px] lg:py-8">
            {/* Address Form Section */}
            <div className="bg-white shadow-lg rounded-lg flex-1 p-4 lg:p-6 order-2 lg:order-1">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Add Address</h1>
                
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <button
                        onClick={handleShipping}
                        className={`px-4 py-2 rounded-md shadow ${
                            view === "ship" ? "bg-blue-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        Shipping Address
                    </button>
                    <button
                        onClick={handleBilling}
                        className={`px-4 py-2 rounded-md shadow ${
                            view === "billing" ? "bg-blue-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        Billing Address
                    </button>
                </div>

                {view === "ship" && (
                    <form onSubmit={handleShippingAddress} className="space-y-4 lg:space-y-6">
                        <h3 className="text-red-600 text-sm">Shipping Address</h3>

                        <div>
                            <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">Contact Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="First Name"
                                        value={firstname}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Last Name"
                                        value={lastname}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No*</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Mobile Number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">Address</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address (House number, building, street area)*
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="House/Building/Street"
                                        value={address1}
                                        onChange={(e) => setAddress1(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Road name/Area/Colony
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Road/Area/Colony"
                                        value={address2}
                                        onChange={(e) => setAddress2(e.target.value)}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Pincode"
                                            value={zipcode}
                                            onChange={(e) => setZipcode(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="State"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            {proceed ? "Proceed to Payment" : "Save Address"}
                        </button>
                    </form>
                )}
                
                {view === "billing" && (
                    <form onSubmit={handleBillingAddress} className="space-y-4 lg:space-y-6">
                        <h3 className="text-red-600 text-sm">Billing Address : Optional</h3>
                        
                        <div>
                            <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">Contact Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="First Name"
                                        value={firstname}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Last Name"
                                        value={lastname}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
                                <input
                                    type="tel"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Mobile Number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">Address</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address (House number, building, street area)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="House/Building/Street"
                                        value={address1}
                                        onChange={(e) => setAddress1(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Road name/Area/Colony
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Road/Area/Colony"
                                        value={address2}
                                        onChange={(e) => setAddress2(e.target.value)}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Pincode"
                                            value={zipcode}
                                            onChange={(e) => setZipcode(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="City"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="State"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Save Address
                        </button>
                    </form>
                )}
            </div>

            {/* Price Details Section - Sticky on mobile */}
            <div className="bg-white shadow-lg rounded-lg p-4 lg:p-6 w-full lg:w-1/3 order-1 lg:order-2 sticky top-0 lg:top-4 z-10">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-3 lg:mb-4">Price Details</h2>

                <div className="border-b pb-3 lg:pb-4 mb-3 lg:mb-4 space-y-2 lg:space-y-3">
                    {/* Total MRP - Always shown */}
                    <div className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-600">Total MRP</span>
                        <span className="text-gray-800 font-medium">
                            {shopOrder.productdiscount > 0
                                ? `₹${(shopOrder.totalmrp + shopOrder.productdiscount).toFixed(2)}`
                                : `₹${shopOrder.totalmrp.toFixed(2)}`}
                        </span>
                    </div>

                    {/* Product Discount - Only shown if > 0 */}
                    {shopOrder.productdiscount > 0 && (
                        <div className="flex justify-between text-sm lg:text-base">
                            <span className="text-gray-600">Product Discount</span>
                            <span className="text-green-600 font-medium">- ₹{shopOrder.productdiscount.toFixed(2)}</span>
                        </div>
                    )}

                    {/* Shipping Fee - Shows "FREE" if 0 */}
                    <div className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-600">Shipping Fee</span>
                        <span className="text-gray-800 font-medium">
                            {shopOrder.shippingfee > 0 ? `₹${shopOrder.shippingfee.toFixed(2)}` : "FREE"}
                        </span>
                    </div>

                    {/* Platform Fee - Always shown */}
                    <div className="flex justify-between text-sm lg:text-base">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="text-gray-800 font-medium">₹{shopOrder.platformfee.toFixed(1)}</span>
                    </div>

                    {/* Coupon Applied - Only shown if exists */}
                    {shopOrder.couponapplied !== 0 && (
                        <div className="flex justify-between text-sm lg:text-base">
                            <span className="text-gray-600">Coupon Applied</span>
                            <span className="text-green-600 font-medium">- {shopOrder.couponapplied}</span>
                        </div>
                    )}

                    {/* Discount Card - Only shown if > 0 */}
                    {shopOrder.discountcard > 0 && (
                        <div className="flex justify-between text-sm lg:text-base">
                            <span className="text-gray-600">Card Discount</span>
                            <span className="text-green-600 font-medium">
                                ₹-{((shopOrder.totalmrp + shopOrder.productdiscount) * shopOrder.discountcard / 100).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-3 lg:pt-4 border-t">
                    <span className="text-base lg:text-lg font-bold text-gray-800">Order Total</span>
                    <span className="text-base lg:text-lg font-bold text-gray-800">₹{shopOrder.orderTotal.toFixed(2)}</span>
                </div>
            </div>
            
            {/* <ToastContainer position="bottom-center" autoClose={3000} /> */}
            <ToastContainer autoClose={3000} />
        </div>
    );
};

export default AddressSection;