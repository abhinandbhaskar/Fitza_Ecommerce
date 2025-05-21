import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import "./DealsOftheDay.css"
import categoryImg1 from "../../../assets/img/category-1.jpg";
import { useNavigate } from "react-router-dom";

import axios from 'axios';
const DealsOftheDay = () => {
  const {accessToken}=useSelector((state)=>state.auth);
  const [endDate,setEndDate]=useState(0);
  const [products,setProducts]=useState([]);
  const [timeLeft,setTimeLeft]=useState({});

   const navigate=useNavigate();
  const calculateTimeLeft = () =>{

    const now=new Date();
    const difference = endDate - now;

    if(difference<=0){
      setTimeLeft({hourse:'00',minutes:'00',seconds:'00'});
    }else{
      const hours=Math.floor((difference/(1000*60*60))%24);
      const minutes=Math.floor((difference/1000/60)%60);
      const seconds=Math.floor((difference/1000)%60);

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });

    }
  };
  const fetchDeals = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/deals_of_day/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Dealsssssssssss", response);
      setProducts(response.data);
      console.log("Dealsssssssssss", response.data[0].end_date);
  
      // Convert end_date string to Date object
      setEndDate(new Date(response.data[0].end_date));
    } catch (errors) {
      console.log(errors);
    }
  };
  
  useEffect(()=>{
    fetchDeals();
  },[])

      const AddToCart=(id)=>{
        console.log("Yo Yo",id);
        navigate(`/productview/${id}`);
    }


  useEffect(() => {
    if (!endDate) return; // Ensure endDate is valid before starting the timer
  
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [endDate]);
  




  return (
    <div className='deals-section'>
      <div className="deals-nav">
        <h1><span>Deals Of The Day </span>With Extra Discount</h1>
        {/* <div className='dealsnav-btn'>
          <button> &lt; </button>
          <button> &gt; </button>
        </div> */}
      </div>

      <div className='h-[200px] w-full flex justify-center'>
        <div className='h-[200px] w-[60%] flex justify-center items-center'>
          <h2 className='flex py-4 font-bold text-2xl'>Deals Ends In</h2>
          <div className='h-16 px-4 w-[120px] bg-orange-300 p-6 flex items-center justify-center rounded-md'>
            <span className='text-orange-600 font-bold text-2xl'>{timeLeft.hours || '00'} h</span>
          </div>
          <span className='flex py-4 font-bold text-2xl'>:</span>
          <div className='h-16 px-4 w-[120px] bg-orange-300 p-6 flex items-center justify-center rounded-md'>
            <span className='text-orange-600 font-bold text-2xl'>{timeLeft.minutes || '00'} m</span>
          </div>
          <span className='flex py-4 font-bold text-2xl'>:</span>
          <div className='h-16 px-4 w-[120px] bg-orange-300 p-6 flex items-center justify-center rounded-md'>
            <span className='text-orange-600 font-bold text-2xl'>{timeLeft.seconds || '00'} s</span>
          </div>
        </div>
      </div>
       
        <div className="popular-cards">

              {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-3 cards"> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 cards">
              {
                products.map((offer,key)=>(
                  <div className="card m-3" onClick={()=>AddToCart(offer.product.id)}>
                
                  <img 

                src={
                  offer.product.items?.[0]?.images?.[0]?.main_image &&
                  `https://127.0.0.1:8000${offer.product.items[0].images[0].main_image}`
                }

                   className="card-img-top dim-image" alt="Card Image" />
                  
                  <div className="card-body">
                    <h5 className="card-title">{offer.product.product_name}</h5>
                  </div>
                </div>

                ))
              }
              </div>
        </div>
    </div>
  )
}

export default DealsOftheDay
