import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./ProductPage.css";
import { useParams } from "react-router-dom";
import ProductView from '../../../components/User/ProductView/ProductView';
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import { useSelector } from 'react-redux';
import { safe } from '../../../utils/safeAccess';
const ProductPage = ({countsN}) => {
  const { id } = useParams();
  const[product,setProduct]=useState([]);
  const {accessToken}=useSelector((state)=>state.auth);
  console.log("Product ID:", id);

  const fetchProductData=async()=>{
    try{
      const response=await axios.get(`https://127.0.0.1:8000/api/view_sell_product/${id}/`,{
          headers:{
              Authorization:`Bearer ${accessToken}`,
          }
      });
      console.log(response);
      console.log("Individual Top Collections",response.data);
      setProduct(safe(response,'data'));
    
  }
    catch(errors){
      console.log(errors);
      console.log(errors.response.data);
    }
  }

useEffect(()=>{
  window.scrollTo(0, 0);
  fetchProductData();
},[])

  return (
    <>
    <Header countsN={countsN}/>
    <ProductView product={product}/>
    <Footer/>
    </>
  )
}

export default ProductPage
