import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import "./DealsOftheDay.css"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { safe } from '../../../utils/safeAccess';
import axios from 'axios';

const DealsOftheDay = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [endDate, setEndDate] = useState(0);
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const navigate = useNavigate();

  const AddProductInteration = async (id, type) => {
    try {
      const response = await axios.post(
        `https://127.0.0.1:8000/api/add_product_interation/${id}/${type}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.log("Error Occurred", error);
    }
  }

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = endDate - now;

    if (difference <= 0) {
      setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
    } else {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/deals_of_day/", {});
      setProducts(response.data);
      setEndDate(new Date(response.data[0].end_date));
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [])

  const AddToCart = (id) => {
    if (!accessToken || accessToken.length === 0) {
      toast.error("You need to login first!");
      return;
    }
    const type = "view";
    AddProductInteration(id, type);
    navigate(`/productview/${id}`);
  }

  useEffect(() => {
    if (!endDate) return;

    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className='deals-section'>
      <div className="deals-nav">
        <h1><span>Deals Of The Day</span> With Extra Discount</h1>
      </div>

      <div className='timer-container'>
        <h2 className='timer-title'>Deals Ends In</h2>
        <div className='timer-wrapper'>
          <div className='timer-box'>
            <span className='timer-value'>{safe(timeLeft, 'hours') || '00'} h</span>
          </div>
          <span className='timer-separator'>:</span>
          <div className='timer-box'>
            <span className='timer-value'>{safe(timeLeft, 'minutes') || '00'} m</span>
          </div>
          <span className='timer-separator'>:</span>
          <div className='timer-box'>
            <span className='timer-value'>{safe(timeLeft, 'seconds') || '00'} s</span>
          </div>
        </div>
      </div>
       
      <div className="popular-cards">
        <div className="product-grid">
          {products.map((offer, key) => (
            <div className="product-card" key={key} onClick={() => AddToCart(offer.product.id)}>
              <img 
                src={
                  offer.product.items?.[0]?.images?.[0]?.main_image &&
                  `https://127.0.0.1:8000${offer.product.items[0].images[0].main_image}`
                }
                className="product-image" 
                alt="Product" 
              />
              <div className="product-info">
                <h5 className="product-title">{offer.product.product_name}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer /> 
    </div>
  )
}

export default DealsOftheDay