import React, { useEffect, useState } from "react";
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const WishlistPage = () => {

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
            fetchWishlist();

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

    return (
        <>
            <Header />
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
                                    <p className="my-4">Clothings</p>
                                    <h4 className="card-title my-2">{value.product_name}</h4>
                                    <h2 className="my-2">*******</h2>
                                    <div className="label-icon my-2">
                                        <h5 className="card-text">
                                            {value.items[0].sale_price}
                                            <span>
                                                <strike> $20</strike>
                                            </span>
                                        </h5>
                                        <button onClick={()=>AddToCart(value.id)}  className="Addcart-icon">
                                            <i className="fa-solid fa-cart-arrow-down"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ))
                        }
               


                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default WishlistPage;
