import React, { useEffect, useState } from 'react';
import Header from '../../../components/User/Header/Header';
import Footer from '../../../components/User/Footer/Footer';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate,useParams } from 'react-router-dom';
import { safe } from '../../../utils/safeAccess';

const CompareProducts = ({ countsN }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [productData, setProductData] = useState([]);
  const navigate=useNavigate();
  const { id } = useParams();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://127.0.0.1:8000/api/compare_products/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setProductData(safe(response,'data'));
      console.log("KUNU",response.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = productData.length - 1;

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(totalSlides - 1, prev + 1));
  };

  const currentProducts = [
    productData[currentIndex],
    productData[currentIndex + 1]
  ];

  // Get all unique specification keys from both products
  const allSpecs = new Set();
  currentProducts.forEach(product => {
    if (product) {
      // Add top-level specs
      const topLevelSpecs = [
        'product_description', 'weight', 'model_height', 'model_wearing'
      ];
      topLevelSpecs.forEach(spec => allSpecs.add(spec));
      
      // Add nested specs
      if (product.ratings) {
        allSpecs.add('average_rating');
        allSpecs.add('total_reviews');
      }
      if (product.items && product.items.length > 0) {
        allSpecs.add('color');
        allSpecs.add('size');
        allSpecs.add('price');
      }
    }
  });


    const AddToCart = (id) => {
        console.log("Yo Yo", id);
        navigate(`/productview/${id}`);
    };

  // Helper function to get display value for a spec
  const getSpecValue = (product, spec) => {
    if (!product) return 'N/A';
    
    switch (spec) {
      case 'average_rating':
        return product.ratings?.average_rating || 'Not Added';
      case 'total_reviews':
        return product.ratings?.total_reviews || 'Not Added';
      case 'color':
        return product.items?.[0]?.color?.color_name || 'N/A';
      case 'size':
        return product.items?.[0]?.size?.size_name || 'N/A';
      case 'price':
        return product?.offers?.[0]?.discount_percentage > 0 
          ? `₹ ${(parseFloat(product.items[0].sale_price) * (1 - parseFloat(product.offers[0].discount_percentage) / 100)).toFixed(2)}`
          : `₹ ${product.items[0].sale_price}`;
      default:
        return product[spec] || 'N/A';
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header countsN={ countsN }/>
      <div className="flex-grow container mx-auto px-4 py-8 mb-[100px]">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Compare Products</h1>
          <p className="text-lg text-gray-600">Side-by-side comparison of our products</p>
        </div>

        <div className="flex justify-between items-center mb-8 mx-8">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-md text-lg ${currentIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
          >
            Previous
          </button>
          <span className="text-gray-600 text-lg">
            Showing {currentIndex + 1}-{Math.min(currentIndex + 2, productData.length)} of {productData.length} products
          </span>
          <button 
            onClick={handleNext}
            disabled={currentIndex === totalSlides - 1}
            className={`px-6 py-3 rounded-md text-lg ${currentIndex === totalSlides - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mx-8">
          {currentProducts.map((product, index) => (
            <div 
              key={product ? product.id : `empty-${index}`} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${!product ? 'opacity-0 h-0' : 'border border-gray-100'}`}
            >
              {product && (
                <>
                  <div className="p-8">
                    {/* Main Image */}
                    <div className="mb-8 h-[400px] flex items-center justify-center">
                      <img 
                        src={'https://127.0.0.1:8000'+product.items?.[0]?.images?.[0]?.main_image || ''} 
                        alt={product.product_name} 
                        className="w-full h-full object-contain mx-auto"
                      />
                    </div>

                    {/* Thumbnail Images */}
                    {product.items?.[0]?.images?.[0] && (
                      <div className="flex justify-center space-x-6 mb-8">
                        {[
                          product.items[0].images[0].sub_image_1,
                          product.items[0].images[0].sub_image_2,
                          product.items[0].images[0].sub_image_3
                        ].filter(Boolean).map((img, imgIndex) => (
                          <img 
                            key={imgIndex}
                            src={'https://127.0.0.1:8000'+img} 
                            alt={`${product.product_name} view ${imgIndex + 1}`}
                            className="w-24 h-30 object-cover border rounded-lg cursor-pointer hover:border-rose-400 transition-all"
                          />
                        ))}
                      </div>
                    )}

                    {/* Product Name */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                      {safe(product,'product_name')}
                    </h2>

                    {/* Brand and Category */}
                    <div className="text-center mb-4">
                      <p className="text-gray-600">
                        Brand: {product.brand?.brand_name || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        Category: {product.category?.category_name || 'N/A'}
                      </p>
                    </div>

                    {/* Price */}

                                        <div  className="text-center mb-6">
                                        {product?.offers?.[0]?.discount_percentage > 0 ? (
                                            <>
                                                <span className="text-gray-400 line-through text-md mr-2">
                                                    ₹{product.items[0].sale_price}
                                                </span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    ₹
                                                    {(
                                                        parseFloat(product.items[0].sale_price) *
                                                        (1 - parseFloat(product.offers[0].discount_percentage) / 100)
                                                    ).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold">₹{product.items[0].sale_price}</span>
                                        )}
                                    </div>
                    {/* Specifications */}
                    <div className="space-y-4">
                      {Array.from(allSpecs).map(spec => (
                        <div key={spec} className="flex justify-between border-b border-gray-100 pb-3">
                          <span className="font-medium text-gray-600 capitalize">
                            {spec.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-gray-800 text-right">
                            {getSpecValue(product, spec)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div onClick={() => AddToCart(product.id)} className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium text-lg transition duration-200">
                      Add to Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompareProducts;