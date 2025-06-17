import React, { useEffect, useState } from "react";
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { safe } from "../../../utils/safeAccess";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const WishlistPage = ({countsN}) => {

    const {accessToken}=useSelector((state)=>state.auth);
    const[fav,setFav]=useState([]);
    const navigate=useNavigate();
    const[items,setItems]=useState(0);

    const fetchWishlist=async()=>{
        try{
            const response=await axios.get("https://127.0.0.1:8000/api/get_wishlist/",{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            });
            // console.log(response);
            console.log(response.data);
            console.log("EEEE",response.data[0].products);
            setFav(response.data[0].products);
            setItems((response.data[0].products).length)
            
            // console.log(response.data[0].products);
            // response.data[0].products.map((value)=>{
            //     console.log(value);
            // })
            

        }catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }
    }

    useEffect(()=>{
        fetchWishlist();
    },[])


    const RemoveFav=async(id)=>{
        console.log("IDD",id);
        try{
            const response=await axios.post(`https://127.0.0.1:8000/api/remove_wishlist/${id}/`,{},{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                },
                withCredentials:true,

            });
            console.log(response);
            console.log(response.data);
            toast.success("product removed...");
            fetchWishlist();

        }
        catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
            toast.error("failed to remove product...");
        }
    }

    const AddToCart=(id)=>{
        console.log("Yo Yo",id);
        navigate(`/productview/${id}`);

    }

    return (
        <>
            <Header countsN={countsN} />
            <div className="collection-container h-auto min-h-[400px] width-screen">
                <div className="py-10 text-center">
                    <h3 className="text-2xl font-semibold text-gray-800">My Wishlist</h3>
                <p className="text-gray-600">{items} item(s)</p>
                </div>


                <div className="Featured-section">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 Feature-Cards gap-20">
                        {
                            fav.map((value,key)=>(
                                <div key="" className="card">
                                <button
                                    className="absolute z-10 top-2 right-2 bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                                    title="Remove from Wishlist"
                                    onClick={()=>RemoveFav(value.id)}
                                >
                                    X
                                </button>
                                <img  src={`https://127.0.0.1:8000${value.items[0].images[0].main_image}`} />

                            <div className="card-body">
                                <h2 className="card-title text-bold text-2xl font-semibold text-gray-800">
                                    {safe(value,'product_name','Default Product Name')}
                                </h2>
                                <h4 className="text-gray-700 leading-relaxed text-lg">
                                    {value.product_description.length > 28
                                        ? `${value.product_description.substring(0, 28)}...`
                                        : value.product_description}
                                </h4>

                                <div>
                                    {/* Price display - only shows sale_price with optional offer discount */}
                                    <div>
                                        {value?.offers?.[0]?.discount_percentage > 0 ? (
                                            <>
                                                <span className="text-gray-400 line-through text-sm mr-2">
                                                    ₹{value.items[0].sale_price}
                                                </span>
                                                <span className="text-xl font-bold text-green-600">
                                                    ₹
                                                    {(
                                                        parseFloat(value.items[0].sale_price) *
                                                        (1 - parseFloat(value.offers[0].discount_percentage) / 100)
                                                    ).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold">₹{value.items[0].sale_price}</span>
                                        )}
                                    </div>

                                    {/* Ratings and offer badge */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 font-medium">
                                                {safe(value,'ratings.average_rating',0).toFixed(1)}
                                            </span>
                                            <span className="text-yellow-400 ml-1">★</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            ({safe(value,'ratings.total_reviews',0)} reviews)
                                        </span>

                                        {/* Only show offer badge when offer exists */}
                                        {value?.offers?.[0]?.discount_percentage > 0 && (
                                            <div className="bg-green-200 text-green-900 px-2 py-1 rounded-md text-sm flex items-center gap-1 w-fit font-bold">
                                                <i className="fa-solid fa-tag text-sm"></i>
                                                <span>{parseFloat(value.offers[0].discount_percentage)}% OFF</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="label-icon my-2">
                                    <button onClick={() => AddToCart(value.id)} className="Addcart-icon">
                                        <i className="fa-solid fa-cart-arrow-down"></i>
                                    </button>
                                </div>
                            </div>

                            </div>
                            ))
                        }
               


                    </div>
                </div>

        <ToastContainer />    
            </div>
            <Footer />
        </>
    );
};

export default WishlistPage;
