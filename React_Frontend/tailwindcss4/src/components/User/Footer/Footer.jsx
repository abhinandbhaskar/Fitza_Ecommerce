import React from 'react'
import "./Footer.css"
import mediaImg1 from "../../../assets/img/icon-facebook.svg";
import mediaImg2 from "../../../assets/img/icon-twitter.svg";
import mediaImg3 from "../../../assets/img/icon-instagram.svg";
import mediaImg4 from "../../../assets/img/icon-pinterest.svg";
import mediaImg5 from "../../../assets/img/icon-youtube.svg";
import emailImg from "../../../assets/img/icon-email.svg";
import PaymentImg from "../../../assets/img/payment-method.png";
const Footer = () => {
  return (
    <div className='Footer-section'>

        <div className="footer-subsection grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className='contact m-2'>
            <h1>Fitza</h1>
            <h5>Contach</h5>
            <h5><span>Address : </span>562 Wellinton Road,Street 32, San Francisco</h5>
            <h5><span>Phone : </span>+01 22222 3345 / +91 9999 3333</h5>
            <h5><span>Hours : </span>10:00 - 18:00 Mon - Sat</h5>
            <h5>Follow Me</h5>
            <div className='Media-icons'>
                <img src={mediaImg1} alt="" />
                <img src={mediaImg2} alt="" />
                <img src={mediaImg3} alt="" />
                <img src={mediaImg4} alt="" />
                <img src={mediaImg5} alt="" />
            </div>
            </div>
            <div className='Address m-2'>
                <h4>Address</h4>
                <h5>About Us</h5>
                <h5>Delivery Information</h5>
                <h5>Privacy Policy</h5>
                <h5>Terms & Conditions</h5>
                <h5>Contact Us</h5>
                <h5>Support Center</h5>
            </div>
            <div className='Address m-2'>
            <h4>My Account</h4>
                <h5>Sign In</h5>
                <h5>View Cart</h5>
                <h5>My Wishlist</h5>
                <h5>Track My Order</h5>
                <h5>Help</h5>
                <h5>Order</h5>
            </div>
            <div className='Payment m-2'>
                <h4>Secured Payment Gateways</h4>
                <img src={PaymentImg} alt="" />
            </div>
        </div>     
    </div>
  )
}

export default Footer
