import React, { useState,useEffect } from 'react'
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';


const CategoryProducts = () => {
    const { pro_name } = useParams();
    const {accessToken}=useSelector((state)=>state.auth);
    const [products,setProducts]=useState([]);
    const navigate=useNavigate();

        const fetchProducts=async()=>{
        
            try{
                const response=await axios.get(`https://127.0.0.1:8000/api/fetch_cate_products/${pro_name}/`,{
                    headers:{
                        Authorization:`Bearer ${accessToken}`,
                    }
                });
                console.log(response);
                console.log("GETTTTT",response.data);
                setProducts(response.data);
               
            }
            catch(errors)
            {
                console.log(errors);
                console.log(errors.response.data);
            }
        }

        const AddToCart=(id)=>{
            console.log("Yo Yo",id);
            navigate(`/productview/${id}`);
    
        }
    

    useEffect(()=>{
        fetchProducts();
    },[])

  return (
    <>
    <Header />
    <div className="h-auto width-screen p-1">
        <div className="p-2">
            {/* <h3 className="text-2xl font-semibold text-gray-800">My Wishlist</h3> */}
        <p className="text-gray-600"> item(s)</p>
        </div>
        <div className=" h-auto w-screen flex flex-row p-2">
        <div className="filter-section h-auto lg:w-1/4 w-full p-6 space-y-6 rounded-lg shadow-lg bg-red-300">
            <h1 className="text-xl text-white font-semibold">Shirt</h1>
            <h2 className="text-lg text-white">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="text-white font-medium">Category:</label>
                <select
                  name="category"
                  id="category"
                  className="w-full p-2 rounded-lg bg-white border-none text-gray-700 hover:bg-gray-200 transition-all"
                >
                  <option value="ethnic">Ethnic Wear</option>
                  <option value="casual">Casual Wear</option>
                  <option value="formal">Formal Wear</option>
                </select>
              </div>

              <div>
                <label className="text-white font-medium">Price:</label>
                <input
                  type="range"
                  className="w-full p-2 rounded-lg bg-white border-none text-gray-700"
                  min="0"
                  max="200"
                  step="10"
                />
                <div className="flex justify-between text-xs text-white">
                  <span>$0</span><span>$200</span>
                </div>
              </div>

              <div>
                <label className="text-white font-medium">Size:</label>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-200 transition-all">XS</button>
                  <button className="px-4 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-200 transition-all">S</button>
                  <button className="px-4 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-200 transition-all">M</button>
                  <button className="px-4 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-200 transition-all">L</button>
                </div>
              </div>

              <div>
                <label className="text-white font-medium">Color:</label>
                <div className="flex space-x-3">
                  <button className="w-6 h-6 bg-white rounded-full border border-gray-500"></button>
                  <button className="w-6 h-6 bg-blue-500 rounded-full"></button>
                  <button className="w-6 h-6 bg-green-500 rounded-full"></button>
                </div>
              </div>
            </div>
          </div>
            <div className='h-auto w-10/2'>

            <div className="Featured-section">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 Feature-Cards gap-10">
                    
                {products.map((product) => (
                            <div key={product.id} className="card">
                                <div className="Tag">
                                    <h6>New</h6>
                                </div>
                                <img
                                 src={ product.images && product.images.length > 0 && `https://127.0.0.1:8000${product.images[0].main_image}`}
                                 className="card-img-top" alt={product.title} />
                                <div className="Cards-Options">
                                    <div className="Cards-Icons">
                                        <div onClick={()=>AddToCart(product.id)}  className="Eye-Icons">
                                            <i className="fa-regular fa-eye"></i>
                                            <div className="tooltip1">Quick View</div>
                                        </div>
                                        <div  onClick={()=>AddToWishlist(product.id)}  className="Heart-Icon">
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
                                    <p className="my-4">Clothings</p>
                                    <h4 className="card-title my-2">{product.product.product_name}</h4>
                                    <h2 className="my-2">*******</h2>
                                    <div className="label-icon my-2">
                                        <h5 className="card-text">
                                            ${product.sale_price}{" "}
                                            <span>
                                                <strike> ${product.original_price}</strike>
                                            </span>
                                        </h5>
                                        <button onClick={()=>AddToCart(product.id)} className="Addcart-icon">
                                            <i className="fa-solid fa-cart-arrow-down"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                     
                </div>
            </div>


            </div>

        </div>
    </div>
    <Footer />
</>
  )
}

export default CategoryProducts


