import React from 'react'
import "./ProductPage.css"
import ProductView from '../../../components/User/ProductView/ProductView'
import Header from "../../../components/User/Header/Header"
import Footer from "../../../components/User/Footer/Footer"
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
