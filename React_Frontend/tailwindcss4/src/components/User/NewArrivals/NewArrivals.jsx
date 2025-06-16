import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewArrivals.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from "../../../utils/safeAccess";

const NewArrivals = ({ setTopData }) => {
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 4;
    const { accessToken } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const handleNext = () => {
        if (startIndex + itemsPerPage < products.length) {
            setStartIndex(startIndex + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - itemsPerPage);
        }
    };

    const fetchNewArrivals = async () => {
        try {
            const response = await axios.get("https://127.0.0.1:8000/api/new_arrivals/", {});
            setProducts(safe(response,'data'));
            setTopData(safe(response,'data'));
        } catch (errors) {
            console.error(errors);
        }
    };

    useEffect(() => {
        fetchNewArrivals();
    }, []);

    const AddToCart = (id) => {
         if(!accessToken || accessToken.length === 0) {
                toast.error("You need to login first!");
                return;
            }
        navigate(`/productview/${id}`);
    };

    
    const CompareProduct = (id) =>{
         if(!accessToken || accessToken.length === 0) {
                toast.error("You need to login first!");
                return;
            }
        console.log("Compare",id)
        navigate(`/compareproducts/${id}`);
    }

    const AddToWishlist = async (id) => {
         if(!accessToken || accessToken.length === 0) {
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
            toast.success("Product added to your wishlist!");
        } catch (errors) {
            console.error(errors);
            toast.error("Failed to add");
        }
    };

    return (
        <div className="collection-container h-auto width-screen">
            <div className="deals-nav py-16">
                <h1>
                    <span>New</span> Arrivals
                </h1>
                <div className="dealsnav-btn">
                    <button onClick={handlePrev} disabled={startIndex === 0}>
                        &lt;
                    </button>
                    <button onClick={handleNext} disabled={startIndex + itemsPerPage >= products.length}>
                        &gt;
                    </button>
                </div>
            </div>

            <div className="Featured-section">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 Feature-Cards gap-20">
                    {products.slice(startIndex, startIndex + itemsPerPage).map((product) => (
                        <div key={safe(product,'id')} className="card">
                            <div className="Tag">
                                <h6>New</h6>
                            </div>
                            <img
                                src={
                                    product.items?.[0]?.images?.[0]?.main_image
                                        ? `https://127.0.0.1:8000${product.items[0].images[0].main_image}`
                                        : "/path/to/default/image.jpg"
                                }
                                alt={safe(product,'product_name')}
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
                                    <div onClick={()=>CompareProduct(product.id)} className="Shuffle-Icon">
                                        <i className="fa-solid fa-shuffle"></i>
                                        <div className="tooltip3">Compare</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <h2 className="card-title text-bold text-2xl font-semibold text-gray-800">
                                    {product.product_name}
                                </h2>
                                <h4 className="text-gray-700 leading-relaxed text-lg">
                                    {product.product_description.length > 28
                                        ? `${product.product_description.substring(0, 28)}...`
                                        : product.product_description}
                                </h4>


                                <div>
                                    {/* Price display - only shows sale_price with optional offer discount */}
                                    <div>
                                        {product?.offers?.[0]?.discount_percentage > 0 ? (
                                            <>
                                                <span className="text-gray-400 line-through text-sm mr-2">
                                                    ₹{product.items[0].sale_price}
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
                                            <span className="text-xl font-bold">₹{product.items[0].sale_price}</span>
                                        )}
                                    </div>

                                    {/* Ratings and offer badge */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 font-medium">
                                                {safe(product,'ratings.average_rating').toFixed(1)}
                                            </span>
                                            <span className="text-yellow-400 ml-1">★</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            ({safe(product,'ratings.total_reviews')} reviews)
                                        </span>

                                        {/* Only show offer badge when offer exists */}
                                        {product?.offers?.[0]?.discount_percentage > 0 && (
                                            <div className="bg-green-200 text-green-900 px-2 py-1 rounded-md text-sm flex items-center gap-1 w-fit font-bold">
                                                <i className="fa-solid fa-tag text-sm"></i>
                                                <span>{parseFloat(product.offers[0].discount_percentage)}% OFF</span>
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
            <ToastContainer />    
        </div>
    );
};

export default NewArrivals;
