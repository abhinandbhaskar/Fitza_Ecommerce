import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { safe } from "../../../../../utils/safeAccess";
const ProductsOfferSection = () => {
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pid, setPid] = useState("");
    const [offerTitle, setOfferTitle] = useState("");
    const [offerDescription, setOfferDescription] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [editingOfferId, setEditingOfferId] = useState(null);
    const { accessToken } = useSelector((state) => state.auth);
    const [producttitle, setProductTitle] = useState("");

    const handleAddOffer = async () => {
        if (selectedProduct && offerTitle && discountPercentage && startDate && endDate) {
            const newOffer = {
                id: editingOfferId || offers.length + 1,
                pid: pid,
                productName: selectedProduct.label,
                offerTitle,
                offerDescription,
                discountPercentage: parseFloat(discountPercentage).toFixed(2),
                startDate,
                endDate,
                isActive: true,
            };

            if (editingOfferId) {
                console.log("Edit OFFERID", editingOfferId);
                console.log("Edit productName", producttitle);

                const editData = {
                    pid: pid,
                    productname: producttitle,
                    offer_title: offerTitle,
                    offer_description: offerDescription,
                    discount_percentage: discountPercentage,
                    start_date: startDate,
                    end_date: endDate,
                };
                console.log("Host", editData);

                try {
                    const response = await axios.post(
                        `https://127.0.0.1:8000/api/admin/edit_product_offer/${editingOfferId}/`,
                        editData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    console.log(response);
                    console.log(response.data);
                    alert(response.data.message);
                    // fetchDiscoundCard()
                } catch (errors) {
                    console.log(errors);
                    console.log(errors.response);
                } finally {
                    fetchProductsOffer();
                }
            } else {
                console.log("New Offer::::", newOffer);

                try {
                    const response = await axios.post("https://127.0.0.1:8000/api/admin/add_product_offer/", newOffer, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    alert(response.data.message);
                    console.log(response);
                    console.log(response.data);
                    fetchProductsOffer();
                } catch (errors) {
                    console.error(errors.response || errors);
                }
            }

            // Reset fields
            setPid("");
            setSelectedProduct(null);
            setOfferTitle("");
            setOfferDescription("");
            setDiscountPercentage("");
            setStartDate("");
            setEndDate("");
            setEditingOfferId(null);
            setProductTitle("");
        }
    };

    const handleEditOffer = async (offerid) => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/admin/get_editproduct_offer/${offerid}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(response.data[0]);
            console.log(response.data[0].id);
            console.log(response.data[0].product.id);

            setPid(response.data[0].product.id);
            setEditingOfferId(response.data[0].id);
            setProductTitle(response.data[0].product.product_name);
            setSelectedProduct(response.data[0].product.id);
            setOfferTitle(response.data[0].offer_title);
            setOfferDescription(response.data[0].offer_description);
            setDiscountPercentage(response.data[0].discount_percentage);
            setStartDate(response.data[0].start_date);
            setEndDate(response.data[0].end_date);
        } catch (errors) {
            console.error(errors.response || errors);
        } finally {
            fetchProductsOffer();
        }
    };

    const handleDeleteOffer = async (offerId) => {
        setOffers(offers.filter((offer) => offer.id !== offerId));

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/delete_product_offer/${offerId}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response);
            console.log(response.data);
            alert(response.data.message);
            fetchProductsOffer();
        } catch (errors) {
            console.log(errors);
            console.log(errors.response);
        }
    };

    const handleToggleActive = async (id, isActive) => {
        const newStatus = isActive ? "false" : "true";
        console.log("IDDD", id);
        console.log("IDDSTATUS", newStatus);

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/admin/offer_active_deactive/${id}/${newStatus}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(response.data);
            alert(response.data.message);
            fetchProductsOffer();
        } catch (error) {
            console.error(error.response || error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/get_select_all_products/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);
            setProducts(response.data);
        } catch (errors) {
            console.log(errors);
        }
    };

    const fetchProductsOffer = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/admin/get_Productsall_offers/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log(response.data);

            setOffers(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchProductsOffer();
    }, []);

    return (
        <div className="w-full bg-white shadow-md py-4 px-6">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                Dashboard &gt; <span className="text-indigo-600">Product Offers</span>
            </h1>

            <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-600">Add Product Offer</h2>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Select
                        options={products.map((product) => ({
                            value: product.id,
                            label: product.product_name,
                        }))}
                        placeholder="Select Product"
                        className="w-full md:w-1/4"
                        value={selectedProduct}
                        onChange={(selected) => {
                            setSelectedProduct(selected);
                            setPid(selected.value);
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Offer Title"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Offer Description"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <input
                        type="number"
                        placeholder="Discount Percentage"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        onClick={handleAddOffer}
                    >
                        {editingOfferId ? "Update Offer" : "Add Offer"}
                    </button>
                </div>
            </div>

            {offers.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-600">Product Offers</h2>
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">No.</th>
                                <th className="border border-gray-300 px-4 py-2">Product Name</th>
                                <th className="border border-gray-300 px-4 py-2">Offer Title</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Discount (%)</th>
                                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                                <th className="border border-gray-300 px-4 py-2">End Date</th>
                                <th className="border border-gray-300 px-4 py-2">Active</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((offer, index) => (
                                <tr key={offer.id}>
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(offer, "product.product_name")}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{safe(offer, "offer_title")}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(offer, "offer_description") || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(offer, "discount_percentage")}%
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(offer, "start_date")
                                            ? new Date(safe(offer, "start_date")).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(offer, "end_date")
                                            ? new Date(safe(offer, "end_date")).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {safe(offer, "is_active") ? "Yes" : "No"}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className={`px-3 py-1.5 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                                    offer.is_active
                                                        ? "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500"
                                                        : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                                                }`}
                                                onClick={() => handleToggleActive(offer.id, offer.is_active)}
                                            >
                                                {offer.is_active ? "Deactivate" : "Activate"}
                                            </button>

                                            <button
                                                className="px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                                                onClick={() => handleEditOffer(offer.id)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                                onClick={() => handleDeleteOffer(offer.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductsOfferSection;
