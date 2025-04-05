import React from 'react'
import "./ProductPage.css"
import ProductView from '../../components/ProductView/ProductView'
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
const ProductPage = () => {
  return (
    <div>
    <Header/>
    <ProductView/>
    <Footer/>
    </div>
  )
}

export default ProductPage
