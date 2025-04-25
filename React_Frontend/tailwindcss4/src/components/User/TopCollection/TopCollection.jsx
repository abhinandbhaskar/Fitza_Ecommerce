import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TopCollection.css"
import {useSelector} from "react-redux"
import { useNavigate } from "react-router-dom";

import productImg1 from "../../../assets/img/product-1-1.jpg";
import productImg2 from "../../../assets/img/product-2-2.jpg";
import productImg3 from "../../../assets/img/product-3-2.jpg";
import productImg4 from "../../../assets/img/product-2-2.jpg";
import productImg5 from "../../../assets/img/product-5-1.jpg";
import productImg6 from "../../../assets/img/product-11-2.jpg";
import productImg7 from "../../../assets/img/product-6-1.jpg";
import productImg8 from "../../../assets/img/product-4-2.jpg";
import { Link } from "react-router-dom";

const TopCollection = () => {
    const {accessToken}=useSelector((state)=>state.auth);
    const[products,setProducts]=useState([]);
    const navigate=useNavigate();

    const fetchTopCollections=async(topfilter)=>{
        try{
            const response=await axios.get(`https://127.0.0.1:8000/api/top_collections/${topfilter}/`,{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            });
            console.log(response);
            console.log("Top Collections Arrivals",response.data);
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

    const Allfetch=()=>{
        const topfilter="all";
        fetchTopCollections(topfilter);
    }
    const Menfetch=()=>{
        const topfilter="men";
        fetchTopCollections(topfilter);
    }
    const Womenfetch=()=>{
        const topfilter="women";
        fetchTopCollections(topfilter);
    }
    const kidsfetch=()=>{
        const topfilter="kids";
        fetchTopCollections(topfilter);
    }

useEffect(()=>{
    const topfilter="all";
  fetchTopCollections(topfilter);
},[])
  return (
    <div className='collection-container h-auto width-screen'>
      <div className='collection-header h-auto w-full text-center my-12'>
   <div><h1 className='text-4xl font-bold py-2'>Our Top Collection</h1></div>
   <div><p className='text-2xl text-gray-600 py-2 font-medium'>Browse The Collection of Top Products</p></div>
   <div className='py-6'>
    <button onClick={Allfetch} className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold">FOR ALL</button>
   <button onClick={()=>Menfetch()} className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold">FOR MEN</button>
   <button onClick={()=>Womenfetch()} className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold">FOR WOMEN</button>
   <button onClick={()=>kidsfetch()} className="py-2 px-4 text-sm md:text-base border-b-4 border-transparent hover:border-red-300 transition-all duration-200 mx-3 font-bold">FOR CHILDREN</button>
   </div>
      </div>

      <div className="Featured-section">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 Feature-Cards gap-20 ">

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
                                        <div className="Eye-Icons">
                                            <i className="fa-regular fa-eye"></i>
                                            <div className="tooltip1">Quick View</div>
                                        </div>
                                        <div className="Heart-Icon">
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
  )
}

export default TopCollection
