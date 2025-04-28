import React from "react";
import "./TopRelease.css";
import productImg1 from "../../../assets/img/product-1-1.jpg";
import productImg2 from "../../../assets/img/product-2-2.jpg";
import productImg3 from "../../../assets/img/product-3-2.jpg";
import productImg4 from "../../../assets/img/product-9-2.jpg";
import productImg5 from "../../../assets/img/product-6-1.jpg";
import productImg6 from "../../../assets/img/product-7-2.jpg";
import productImg7 from "../../../assets/img/product-3-2.jpg";
import productImg8 from "../../../assets/img/product-2-2.jpg";
import productImg9 from "../../../assets/img/product-4-1.jpg";
import productImg10 from "../../../assets/img/product-9-1.jpg";
import productImg11 from "../../../assets/img/product-8-2.jpg";
import productImg12 from "../../../assets/img/product-10-2.jpg";

const sectionNames = ["Hot Releases", "Trending Products", "Top Picks", "Must-Have Styles"];

const TopRelease = ({ topdata }) => {
  return (
    <div className="TopSelling-section p-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sell-Details">
        {sectionNames.map((sectionName, colIndex) => (
          <div key={colIndex} className="top-nav">
            <div className="nav-head mb-4">
              <h5 className="text-lg font-semibold text-gray-800">{sectionName}</h5>
              <div className="horizontal-line w-full h-px bg-gray-300 mt-1"></div>
            </div>
            <div className="space-y-4">
              {topdata.slice(colIndex * 3, (colIndex + 1) * 3).map((product, rowIndex) => {
                // Using product data to dynamically show images and other details
                const productImage = product.image || productImg1; // Fallback to default image

                return (
                  <div
                    key={rowIndex}
                    className="card TopSelling-Cards bg-white shadow-md rounded-md p-3 hover:shadow-lg transition-shadow"
                  >
                    <img
                       src={ product.images && product.images.length > 0 && `https://127.0.0.1:8000${product.images[0].main_image}`}
                      className="ProductImgs w-full h-36 object-cover rounded-md"
                      alt={`Product ${product.id}`}
                    />
                    <div className="product-details mt-1 flex flex-col pt-2">
                      <h5 className="text-sm font-medium text-gray-700">{product.product.product_name}</h5>
                      <h4 className="text-sm font-semibold text-gray-800 mt-1">
                        {/* Example price, update with actual price from product */}
                        {product.sale_price}{" "}
                        <span className="text-gray-500 text-xs line-through">$245.80</span>
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRelease;
