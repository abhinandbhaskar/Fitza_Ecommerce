import React, { useState } from "react";
import Product1 from "../../../Assets/img/product-8-1.jpg";
import Product2 from "../../../Assets/img/product-8-2.jpg";
import user1 from "../../../Assets/img/avatar-1.jpg";
import user2 from "../../../Assets/img/avatar-2.jpg";
import user3 from "../../../Assets/img/avatar-3.jpg";
import heart from "../../../Assets/img/icon-heart.svg";

function ProductPage({product}) {
  const [addInfoToggle, setAddInfoToggle] = useState("addInfo");
  let element;

const AdditionalInfo = ({product}) => {
  return (
    <div className="p-4 border border-gray-400 rounded-lg overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <tbody>
          <tr>
            <th className="border-b border-gray-400 py-2 px-4">Product Category</th>
            <td className="border-b border-gray-400 py-2 px-4">{product?.category?.category_name||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">Model height</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.product?.model_height||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">Model wearing</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.product?.model_wearing||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">Care Instructions</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.product?.care_instructions||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">About product</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.product?.about||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">Product Code</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.product_code||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">Shop</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.shop?.shop_name||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">Shop rating</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.shop?.rating||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">About shop</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.shop?.description||""}</td>
          </tr>
          <tr>
            <td className="border-b border-gray-400 py-2 px-4">Brand {product?.brand?.brand_name||""} about product</td>
            <td className="border-b border-gray-400 py-2 px-4">{product?.brand?.brand_description||""}</td>
          </tr>
      
        </tbody>
      </table>
    </div>
  );
};

  const AddReview = () => {
    return (
      <div className="p-4 border border-gray-400 rounded-lg">
        <div className="space-y-6">
          {[user1, user2, user3].map((user, index) => (
            <div className="flex items-center space-x-4" key={index}>
              <img src={user} alt="User" className="w-12 h-12 rounded-full" />
              <div>
                <h6 className="font-bold">Jacky Chan</h6>
                <p className="text-sm">Thank you, very fast shipping</p>
                <span className="text-xs text-gray-500">December 4, 2020 at 3:12 PM</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h4 className="font-bold mb-2">Add a Review</h4>
          <textarea
            placeholder="Write Comment"
            className="w-full border border-gray-400 rounded-lg p-2 mb-4"
          ></textarea>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border border-gray-400 rounded-lg p-2"
              placeholder="Name"
              type="text"
            />
            <input
              className="border border-gray-400 rounded-lg p-2"
              placeholder="Email"
              type="email"
            />
          </div>
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
            Submit Review
          </button>
        </div>
      </div>
    );
  };

  if (addInfoToggle === "addInfo") {
    element = <AdditionalInfo product={product} />;
  } else if (addInfoToggle === "AddReview") {
    element = <AddReview />;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.images && product.images.length > 0 && `https://127.0.0.1:8000${product.images[0].main_image}`} alt="Product" className="w-full rounded-lg" />
          <div className="flex space-x-4 mt-4">
            <img src={product.images && product.images.length > 0 && `https://127.0.0.1:8000${product.images[0].sub_image_1}`} alt="Product" className="w-24 h-24 rounded-lg" />
            <img src={product.images && product.images.length > 0 && `https://127.0.0.1:8000${product.images[0].sub_image_2}`} alt="Product" className="w-24 h-24 rounded-lg" />
            <img src={product.images && product.images.length > 0 && `https://127.0.0.1:8000${product.images[0].sub_image_3}`} alt="Product" className="w-24 h-24 rounded-lg" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold">{product?.product?.product_name || ""}</h2>
          <h5 className="text-lg mt-2">
            Brand: <span className="text-green-600 font-bold">{product?.brand?.brand_name||""}</span>
          </h5>
          <hr className="my-4" />
          <h3 className="text-xl font-semibold">
            <span className="text-green-600 text-2xl">₹ {product?.original_price||""}</span> <strike>$200.00</strike> 25% Off
          </h3>
          <p className="mt-4 text-gray-700">
           {product?.product?.product_description||""}
          </p>
          <ul className="mt-4 space-y-2">
            <li>1 Year AL Jazeera Brand Warranty</li>
            <li>30 Day Return Policy</li>
            <li>Cash on Delivery available</li>
          </ul>
          <div className="flex space-x-4 mt-6">
            <div className="px-4 py-2 border rounded-lg">M</div>
            <div className="px-4 py-2 border rounded-lg">L</div>
            <div className="px-4 py-2 border rounded-lg">XL</div>
            <div className="px-4 py-2 border rounded-lg">XXL</div>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <input
              type="number"
              className="border rounded-lg p-2 w-24"
              placeholder="1"
            />
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Add to Cart
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Buy Now
            </button>
          </div>

          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-semibold">Product Details</h4>
            <table className="mt-4 w-full border-collapse border border-gray-300 text-left">
              <tbody>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Brand</th>
                  <td className="border border-gray-300 px-4 py-2">{product?.brand?.brand_name||""}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Material</th>
                  <td className="border border-gray-300 px-4 py-2">{product?.product?.about||""}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Color</th>
                  <td className="border border-gray-300 px-4 py-2">{product?.color?.color_name}</td>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Availability</th>
                  <td className="border border-gray-300 px-4 py-2">{product?.quantity_in_stock||""} items In Stock</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
            <div className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Tabs for toggling */}
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                addInfoToggle === "addInfo"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setAddInfoToggle("addInfo")}
            >
              Additional Info
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                addInfoToggle === "AddReview"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setAddInfoToggle("AddReview")}
            >
              Add Review
            </button>
          </div>
  
          {/* Conditional rendering */}
          {addInfoToggle === "addInfo" ? <AdditionalInfo product={product} /> : <AddReview />}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;











// function ProductPage() {
//     const [addInfoToggle, setAddInfoToggle] = useState("addInfo");
  
//     const AdditionalInfo = () => {
//       return (
//         <div className="p-4 border rounded-lg">
//           <table className="w-full text-left border-collapse">
//             <tbody>
//               <tr>
//                 <th className="border-b py-2 px-4">Stand Up</th>
//                 <td className="border-b py-2 px-4">35hahahhhhshsahaahah</td>
//               </tr>
//               {/* Other rows */}
//             </tbody>
//           </table>
//         </div>
//       );
//     };
  
//     const AddReview = () => {
//       return (
//         <div className="p-4 border rounded-lg">
//           <div className="space-y-6">
//             {[user1, user2, user3].map((user, index) => (
//               <div className="flex items-center space-x-4" key={index}>
//                 <img src={user} alt="User" className="w-12 h-12 rounded-full" />
//                 <div>
//                   <h6 className="font-bold">Jacky Chan</h6>
//                   <p className="text-sm">Thank you, very fast shipping</p>
//                   <span className="text-xs text-gray-500">December 4, 2020 at 3:12 PM</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* Add review form */}
//         </div>
//       );
//     };
  
//     return (
//       <div className="min-h-screen p-8 bg-gray-100">
//         <div className="max-w-7xl mx-auto">
//           {/* Tabs for toggling */}
//           <div className="flex space-x-4 mb-4">
//             <button
//               className={`px-4 py-2 rounded-lg ${
//                 addInfoToggle === "addInfo"
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-200"
//               }`}
//               onClick={() => setAddInfoToggle("addInfo")}
//             >
//               Additional Info
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg ${
//                 addInfoToggle === "AddReview"
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-200"
//               }`}
//               onClick={() => setAddInfoToggle("AddReview")}
//             >
//               Add Review
//             </button>
//           </div>
  
//           {/* Conditional rendering */}
//           {addInfoToggle === "addInfo" ? <AdditionalInfo /> : <AddReview />}
//         </div>
//       </div>
//     );
//   }
  
//   export default ProductPage;
  

