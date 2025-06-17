import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { safe } from "../../../utils/safeAccess";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const OfferSection = ({ countsN }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchOfferProducts = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/offer_products/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProducts(safe(response,'data'));
      console.log("Offer Products:", response.data);
    } catch (errors) {
      console.error(errors);
    }
  };

      const AddToCart = (id) => {
        console.log("Yo Yo", id);
        navigate(`/productview/${id}`);
    };

    const CompareProduct = (id) =>{
        console.log("Compare",id)
        navigate(`/compareproducts/${id}`);
    }

  useEffect(() => {
    fetchOfferProducts();
  }, []);

  // Filter products to only include those with active offers (current date between start and end dates)
  const getActiveOfferProducts = () => {
    const currentDate = new Date();
    return products.filter(product => {
      const startDate = new Date(product.start_date);
      const endDate = new Date(product.end_date);
      return currentDate >= startDate && currentDate <= endDate;
    });
  };

  const activeOfferProducts = getActiveOfferProducts();



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
            toast.success("product added to wishlist!");
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
            toast.error("error occured...")
        }
    };

  return (
    <>
      <Header countsN={countsN} />
      <div className="collection-container h-auto w-screen">
        <div className="collection-header h-auto w-full text-center my-12">
          <div>
            <h1 className="text-4xl font-bold py-2">Offers Products</h1>
          </div>
          <div>
            <p className="text-2xl text-gray-600 py-2 font-medium">Exclusive Discounts</p>
          </div>
        </div>

        {activeOfferProducts.length > 0 ? (
          <div className="Featured-section">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 Feature-Cards gap-20 ">
              {activeOfferProducts.map((product) => (
                <div key={safe(product,'product.id')} className="card">
                  <div className="Tag">
                    <h6>New</h6>
                  </div>
                  <img
                    src={
                      product.product.items?.[0]?.images?.[0]?.main_image
                        ? `https://127.0.0.1:8000${product.product.items[0].images[0].main_image}`
                        : "/path/to/default/image.jpg" // Fallback image
                    }
                    alt={safe(product,'product.product_name')}
                    className="card-img-top"
                  />
                  <div className="Cards-Options">
                    <div className="Cards-Icons">
                      <div onClick={() => AddToCart(product.product.id)} className="Eye-Icons">
                        <i className="fa-regular fa-eye"></i>
                        <div className="tooltip1">Quick View</div>
                      </div>
                      <div onClick={() => AddToWishlist(product.product.id)} className="Heart-Icon">
                        <i className="fa-regular fa-heart"></i>
                        <div className="tooltip2">Add To Wishlist</div>
                      </div>
                      <div onClick={()=>CompareProduct(product.product.id)} className="Shuffle-Icon">
                        <i className="fa-solid fa-shuffle"></i>
                        <div className="tooltip3">Compare</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <h2 className="card-title text-bold text-2xl font-semibold text-gray-800">
                      {safe(product,'product.product_name')}
                    </h2>
                    <h4 className="text-gray-700 leading-relaxed text-lg">
                      {product.product.product_description.length > 28
                        ? `${product.product.product_description.substring(0, 28)}...`
                        : product.product.product_description}
                    </h4>

                    <div>
                      {/* Price display - only shows sale_price with optional offer discount */}
                      <div>
                        {product?.product?.offers?.[0]?.discount_percentage > 0 ? (
                          <>
                            <span className="text-gray-400 line-through text-sm mr-2">
                              ${product.product.items[0].sale_price}
                            </span>
                            <span className="text-xl font-bold text-green-600">
                              $
                              {(
                                parseFloat(product.product.items[0].sale_price) *
                                (1 - parseFloat(product.product.offers[0].discount_percentage) / 100)
                              ).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold">${product.product.items[0].sale_price}</span>
                        )}
                      </div>

                      {/* Ratings and offer badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500 font-medium">
                            {safe(product,'product.ratings.average_rating').toFixed(1)}
                          </span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({safe(product,'product.ratings.total_reviews')} reviews)
                        </span>

                        {/* Only show offer badge when offer exists */}
                        {product?.product?.offers?.[0]?.discount_percentage > 0 && (
                          <div className="bg-green-200 text-green-900 px-2 py-1 rounded-md text-sm flex items-center gap-1 w-fit font-bold">
                            <i className="fa-solid fa-tag text-sm"></i>
                            <span>{parseFloat(product.product.offers[0].discount_percentage)}% OFF</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="label-icon my-2">
                      <button onClick={() => AddToCart(product.product.id)} className="Addcart-icon">
                        <i className="fa-solid fa-cart-arrow-down"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No active offers available at the moment.</p>
          </div>
        )}
      </div>
      <ToastContainer/>    
      <Footer />
    </>
  );
};

export default OfferSection;