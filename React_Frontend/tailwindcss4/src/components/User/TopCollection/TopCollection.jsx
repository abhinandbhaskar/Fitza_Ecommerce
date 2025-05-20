import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TopCollection.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TopCollection = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [filtersts, setFilterSts] = useState("all");

    const fetchTopCollections = async () => {
        try {
            const response = await axios.get(`https://127.0.0.1:8000/api/top_collections/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response);
            console.log("Top Collections ArrivalsRRRRR", response.data);
            setProducts(response.data);
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };
    const AddToCart = (id) => {
        console.log("Yo Yo", id);
        navigate(`/productview/${id}`);
    };

    const AddToWishlist = async (id) => {
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
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }
    };

    useEffect(() => {
        fetchTopCollections();
    }, []);
    return (
        <div className="collection-container h-auto width-screen">
            <div className="collection-header h-auto w-full text-center my-12">
                <div>
                    <h1 className="text-4xl font-bold py-2">Our Top Collection</h1>
                </div>
                <div>
                    <p className="text-2xl text-gray-600 py-2 font-medium">Browse The Collection of Top Products</p>
                </div>
                <div className="py-6">
                    <button
                        onClick={() => setFilterSts("all")}
                        className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold"
                    >
                        FOR ALL
                    </button>
                    <button
                        onClick={() => setFilterSts("Men's Wear")}
                        className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold"
                    >
                        FOR MEN
                    </button>
                    <button
                        onClick={() => setFilterSts("Women's Wear")}
                        className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold"
                    >
                        FOR WOMEN
                    </button>
                    <button
                        onClick={() => setFilterSts("Kid's Wear")}
                        className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold"
                    >
                        FOR CHILDREN
                    </button>
                </div>
            </div>

            <div className="Featured-section">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 Feature-Cards gap-20 ">
                    { (filtersts==="all"?products:products.filter((item)=>(item.category.category_name===filtersts))).map((product) => (
                  
                        <div key={product.id} className="card">
                            <div className="Tag">
                                <h6>New</h6>
                            </div>
                            <img
                                src={
                                    product.items?.[0]?.images?.[0]?.main_image
                                        ? `https://127.0.0.1:8000${product.items[0].images[0].main_image}`
                                        : "/path/to/default/image.jpg" // Fallback image
                                }
                                alt={product.product_name}
                                className="card-img-top"
                            />
                            <div className="Cards-Options">
                                <div className="Cards-Icons">
                                    <div onClick={() => AddToCart(product.items[0].id)} className="Eye-Icons">
                                        <i className="fa-regular fa-eye"></i>
                                        <div className="tooltip1">Quick View</div>
                                    </div>
                                    <div onClick={() => AddToWishlist(product.items[0].id)} className="Heart-Icon">
                                        <i className="fa-regular fa-heart"></i>
                                        <div className="tooltip2">Add To Wishlist</div>
                                    </div>
                                    <div className="Shuffle-Icon">
                                        <i className="fa-solid fa-shuffle"></i>
                                        <div className="tooltip3">Compare</div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <h2 className="card-title my-2 text-bold text-xl">{product.product_name}</h2>
                                <div>
                                    <span className="text-xl font-bold">${product.items[0].sale_price}</span>
                                    {product.items[0].sale_price < product.items[0].original_price && (
                                        <span className="text-gray-400 line-through text-sm ml-2">
                                            ${product.items[0].original_price}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 font-medium">
                                            {product.ratings.average_rating.toFixed(1)}
                                        </span>
                                        <span className="text-yellow-400 ml-1">★</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">({product.ratings.total_reviews} reviews)</span>
                                </div>
                                {/* {product?.product?.active_offer &&
    parseFloat(product.product.active_offer.discount_percentage) > 0 && (
      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs flex items-center gap-1 w-fit">
        <i className="fa-solid fa-tag text-xs"></i>
        <span>
          {parseFloat(product.product.active_offer.discount_percentage)}% OFF
        </span>
      </div>
  )} */}
                                <div className="label-icon my-2">
                                    <button onClick={() => AddToCart(product.items[0].id)} className="Addcart-icon">
                                        <i className="fa-solid fa-cart-arrow-down"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopCollection;
