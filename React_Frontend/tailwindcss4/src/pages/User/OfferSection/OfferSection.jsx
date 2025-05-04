import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";

const OfferSection = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);

  const fetchOfferProducts = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/offer_products/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProducts(response.data);
      console.log("Offer Products:", response.data);
    } catch (errors) {
      console.error(errors);
    }
  };

  useEffect(() => {
    fetchOfferProducts();
  }, []);

  return (
    <>
      <Header />
      <div className="collection-container h-auto w-screen">
        <div className="collection-header h-auto w-full text-center my-12">
          <div>
            <h1 className="text-4xl font-bold py-2">Offer Products</h1>
          </div>
          <div>
            <p className="text-2xl text-gray-600 py-2 font-medium">Exclusive Discounts</p>
          </div>
        </div>

        <div className="Featured-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-20">
            {products.map((product) => (
              <div
                key={product?.id}
                className="w-[400px] p-14 bg-white shadow-lg rounded-xl overflow-hidden transition transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={
                      product.product.items?.[0]?.images?.[0]?.main_image
                        ? `https://127.0.0.1:8000${product.product.items[0].images[0].main_image}`
                        : "/path/to/default/image.jpg"
                    }
                    className="w-full h-64 object-cover"
                    alt={product.product.product_name}
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs uppercase font-bold px-2 py-1 rounded">
                    New
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs uppercase font-bold px-2 py-1 rounded">
                    {product.discount_percentage}% OFF
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold truncate">
                    {product.offer_title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{product.offer_description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-lg font-bold">
                      ${product.product.sale_price}{" "}
                      <span className="line-through text-gray-400 text-sm">
                        ${product.product.original_price}
                      </span>
                    </div>
                    <button
                      onClick={() => AddToCart(product.product.id)}
                      className="text-white bg-blue-500 p-3 rounded-full hover:bg-blue-600 transition"
                    >
                      <i className="fa-solid fa-cart-arrow-down"></i>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-6">
                      <button
                        onClick={() => AddToCart(product.product.id)}
                        className="text-gray-500 hover:text-blue-500 transition"
                      >
                        <i className="fa-regular fa-eye"></i>
                        <span className="sr-only">Quick View</span>
                      </button>
                      <button
                        onClick={() => AddToWishlist(product.product.id)}
                        className="text-gray-500 hover:text-red-500 transition"
                      >
                        <i className="fa-regular fa-heart"></i>
                        <span className="sr-only">Add to Wishlist</span>
                      </button>
                      <button className="text-gray-500 hover:text-green-500 transition">
                        <i className="fa-solid fa-shuffle"></i>
                        <span className="sr-only">Compare</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OfferSection;
