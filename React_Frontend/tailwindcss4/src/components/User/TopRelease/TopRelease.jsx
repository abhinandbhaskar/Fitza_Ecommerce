import React from "react";
import "./TopRelease.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from "../../../utils/safeAccess";
import { useSelector } from "react-redux";
const sectionNames = ["Hot Releases", "Trending Products", "Top Picks", "Must-Have Styles"];

const TopRelease = ({ topdata }) => { 
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const viewProduct = (id) => {
       if(!accessToken || accessToken.length === 0) {
          toast.error("You need to login first!");
          return;
        }
        return navigate(`/productview/${id}`);
 
  }

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
                const productImage = product.items?.[0]?.images?.[0];
                
                return (
                  <div
                    key={rowIndex}
                    className="card TopSelling-Cards bg-white shadow-md rounded-md p-3 hover:shadow-lg transition-shadow"
                    onClick={() => viewProduct(product.id)}
                  >
                    <img
                      src={
                        product.items?.[0]?.images?.[0]?.main_image
                          ? `https://127.0.0.1:8000${product.items[0].images[0].main_image}`
                          : "/path/to/default/image.jpg"
                      }
                      className="ProductImgs w-full h-36 object-cover rounded-md"
                      alt={`Product ${safe(product, 'id')}`}
                    />
                    <div className="product-details mt-1 flex flex-col pt-2">
                      <h5 className="text-sm font-medium text-gray-700">{safe(product, 'product_name')}</h5>
                      <h4 className="text-sm font-semibold text-gray-800 mt-1">
                        ₹{product.items[0].sale_price}{" "}
                      </h4>
                     
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default TopRelease;