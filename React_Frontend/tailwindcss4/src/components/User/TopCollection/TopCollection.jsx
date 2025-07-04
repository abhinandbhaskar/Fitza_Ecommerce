import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TopCollection.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { safe } from "../../../utils/safeAccess";

const TopCollection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        totalPages: 1,
    });
    const navigate = useNavigate();
    const [filtersts, setFilterSts] = useState("all");

    const fetchTopCollections = async (page = 1) => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/top_collections/?page=${page}`, {});
            console.log(response);
            console.log("Top Collections ArrivalsRRRRR", response.data.results);
            setProducts(safe(response, "data.results"));
            setPagination({
                count: safe(response, "data.count"),
                next: safe(response, "data.next"),
                previous: safe(response, "data.previous"),
                currentPage: page,
                totalPages: Math.ceil(response.data.count / 12),
            });
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    const AddProductInteration = async (id, type) => {
        try {
            // const type = "view";
            const response = await axios.post(
                `https://127.0.0.1:8000/api/add_product_interation/${id}/${type}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("Response:", response.data);
        } catch (error) {
            console.log("Error Occurred", error);
        }
    };

    const AddToCart = (id) => {
        console.log("clicked");
        if (!accessToken || accessToken.length === 0) {
            toast.error("You need to login first!");
            return;
        }
        console.log("Yo Yo", id);
        const type = "view";
        AddProductInteration(id, type);
        navigate(`/productview/${id}`);
    };

    const CompareProduct = (id) => {
        if (!accessToken || accessToken.length === 0) {
            toast.error("You need to login first!");
            return;
        }
        console.log("Compare", id);
        navigate(`/compareproducts/${id}`);
    };

    const AddToWishlist = async (id) => {
        const type = "favorite";
        AddProductInteration(id, type);

        if (!accessToken || accessToken.length === 0) {
            toast.error("You need to login first!");
            return;
        }

        try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/add_wishlist/${id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(response);
            console.log("Wishlist Res", response.data);
            toast.success("Product added to your wishlist!");
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
            toast.error("Failed to add");
        }
    };

    useEffect(() => {
        fetchTopCollections();
    }, []);

    const handlePageChange = (page) => {
        fetchTopCollections(page);
    };

    return (
        <div className="collection-container h-auto width-screen">
            <div className="collection-header w-full text-center my-6 md:my-12 px-4">
                <div className="mb-4">
                    <h1 className="text-xl font-bold py-1 md:text-3xl lg:text-4xl">Our Top Collection</h1>
                </div>
                <div className="mb-4">
                    <p className="text-sm md:text-lg lg:text-xl text-gray-600 py-1 font-medium">
                        Browse The Collection of Top Products
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 py-2 md:py-4">
                    <button
                        onClick={() => setFilterSts("all")}
                        className="py-1 px-2 text-xs md:py-2 md:px-4 md:text-sm lg:text-base border-b-2 md:border-b-4 border-transparent hover:border-red-300 transition-all duration-200 font-medium md:font-bold mx-1 md:mx-2"
                    >
                        FOR ALL
                    </button>
                    <button
                        onClick={() => setFilterSts("Men's Wear")}
                        className="py-1 px-2 text-xs md:py-2 md:px-4 md:text-sm lg:text-base border-b-2 md:border-b-4 border-transparent hover:border-red-300 transition-all duration-200 font-medium md:font-bold mx-1 md:mx-2"
                    >
                        FOR MEN
                    </button>
                    <button
                        onClick={() => setFilterSts("Women's Wear")}
                        className="py-1 px-2 text-xs md:py-2 md:px-4 md:text-sm lg:text-base border-b-2 md:border-b-4 border-transparent hover:border-red-300 transition-all duration-200 font-medium md:font-bold mx-1 md:mx-2"
                    >
                        FOR WOMEN
                    </button>
                    <button
                        onClick={() => setFilterSts("Kid's Wear")}
                        className="py-1 px-2 text-xs md:py-2 md:px-4 md:text-sm lg:text-base border-b-2 md:border-b-4 border-transparent hover:border-red-300 transition-all duration-200 font-medium md:font-bold mx-1 md:mx-2"
                    >
                        FOR CHILDREN
                    </button>
                </div>
            </div>

            <div className="Featured-section">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 Feature-Cards gap-20 ">
                    {(filtersts === "all"
                        ? products
                        : products.filter((item) => safe(item, "category.category_name") === filtersts)
                    ).map((product) => (
                        <div key={product.id} className="card">
                            {new Date() >= new Date(product.added_date) &&
                                new Date() <= new Date(new Date(product.added_date).getTime() + 172800000) && (
                                    <div className="Tag">
                                        <h6>New</h6>
                                    </div>
                                )}

                            <img
                                src={
                                    product.items?.[0]?.images?.[0]?.main_image
                                        ? `https://127.0.0.1:8000${product.items[0].images[0].main_image}`
                                        : "/path/to/default/image.jpg" // Fallback image
                                }
                                alt={safe(product, "product_name")}
                                className="card-img-top"
                            />
                            <div className="Cards-Options">
                                <div className="Cards-Icons">
                                    <div onClick={() => AddToCart(product.id)} className="Eye-Icons">
                                        <i className="fa-regular fa-eye"></i>
                                        <div className="tooltip1">Quick View</div>
                                    </div>
                                    <div onClick={() => AddToWishlist(product.id)} className="Heart-Icon">
                                        <i className="fa-regular fa-heart"></i>
                                        <div className="tooltip2">Add To Wishlist</div>
                                    </div>
                                    <div onClick={() => CompareProduct(product.id)} className="Shuffle-Icon">
                                        <i className="fa-solid fa-shuffle"></i>
                                        <div className="tooltip3">Compare</div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <h2 className="card-title text-bold text-xl font-semibold text-gray-800 md:text-2xl">
                                    {/* {safe(product,'product_name')} */}

                                    {product.product_name.length > 18
                                        ? `${product.product_name.substring(0, 18)}..`
                                        : product.product_name}
                                </h2>
                                <h5 className="text-gray-700 leading-relaxed text:md md:text-lg">
                                    {product.product_description.length > 25
                                        ? `${product.product_description.substring(0, 25)}...`
                                        : product.product_description}
                                </h5>

                                <div>
                                    {/* Price display - only shows sale_price with optional offer discount */}
                                    <div className="p-0">
                                        {product?.offers?.[0]?.discount_percentage > 0 ? (
                                            <>
                                                <span className="text-gray-400 line-through text-sm mr-2">
                                                    ₹{safe(product, "items[0].sale_price")}
                                                </span>
                                                <span className="text-xl font-bold text-green-600">
                                                    ₹
                                                    {(
                                                        parseFloat(product.items[0].sale_price) *
                                                        (1 - parseFloat(product.offers[0].discount_percentage) / 100)
                                                    ).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold ">₹{product.items[0].sale_price}</span>
                                        )}
                                    </div>

                                    {/* Ratings and offer badge */}
                                    <div className="flex items-center mb-2 md:gap-2">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 font-medium">
                                                {safe(product, "ratings.average_rating").toFixed(1)}
                                            </span>
                                            <span className="text-yellow-400 ml-1">★</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            ({safe(product, "ratings.total_reviews")} reviews)
                                        </span>

                                        {/* Only show offer badge when offer exists */}
                                        {product?.offers?.[0]?.discount_percentage > 0 && (
                                            <div className="bg-green-200 text-green-900 px-2 py-1 rounded-md text-sm flex items-center gap-1 w-fit font-bold">
                                                <i className="fa-solid fa-tag text-sm"></i>
                                                <span>
                                                    {parseFloat(safe(product, "offers[0].discount_percentage"))}% OFF
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="label-icon my-2">
                                    <button onClick={() => AddToCart(product.id)} className="Addcart-icon">
                                        <i className="fa-solid fa-cart-arrow-down"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center my-8">
                <nav className="inline-flex rounded-md shadow">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.previous}
                        className={`px-4 py-2 rounded-l-md border ${
                            !pagination.previous
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        Previous
                    </button>
                    {[...Array(pagination.totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 border-t border-b ${
                                pagination.currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.next}
                        className={`px-4 py-2 rounded-r-md border ${
                            !pagination.next
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        Next
                    </button>
                </nav>
            </div>

            <ToastContainer />
        </div>
    );
};

export default TopCollection;
