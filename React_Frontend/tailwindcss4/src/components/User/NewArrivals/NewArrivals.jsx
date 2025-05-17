import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewArrivals.css";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";

const NewArrivals = ({setTopData}) => {
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 4;
    const {accessToken}=useSelector((state)=>state.auth);
    const [products,setProducts]=useState([]);

    const navigate=useNavigate();
    console.log("OOXZ",products);
    const handleNext = () => {
        if (startIndex + itemsPerPage < products.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };
    
    const fetchNewArrivals=async()=>{
    
        try{
            const response=await axios.get("https://127.0.0.1:8000/api/new_arrivals/",{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            });
            console.log(response);
            console.log("New Arrivals",response.data);
            setProducts(response.data);
            setTopData(response.data);
        }
        catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }
    }

    useEffect(()=>{
        fetchNewArrivals();
    },[])

    const AddToCart=(id)=>{
        console.log("Yo Yo",id);
        navigate(`/productview/${id}`);
    }


    
    const AddToWishlist=async(id)=>{
    

        try{
            
                const response=await axios.post(`https://127.0.0.1:8000/api/add_wishlist/${id}/`,{},{
                    headers:{
                        Authorization:`Bearer ${accessToken}`,
                    },
                    withCredentials:true,
                });
                console.log(response);
                console.log("Wishlist Res",response.data);
                
              
            }
            catch(errors)
            {
                console.log(errors);
                console.log(errors.response.data);
            }
    
    
        }
    
    

    return (
        <div className="collection-container h-auto width-screen">
            <div className="deals-nav py-16">
                <h1>
                    <span>New</span> Arrivals
                </h1>
                <div className="dealsnav-btn">
                    <button onClick={handlePrev} disabled={startIndex === 0}>
                        &lt;
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={startIndex + itemsPerPage >= products.length}
                    >
                        &gt;
                    </button>
                </div>
            </div>
            <div className="Featured-section">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 Feature-Cards gap-20">
                    {products
                        .slice(startIndex, startIndex + itemsPerPage)
                        .map((product) => (
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
    );
};

export default NewArrivals;
