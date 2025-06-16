import React from 'react';
import "./Footer.css";
import mediaImg1 from "../../../assets/img/icon-facebook.svg";
import mediaImg2 from "../../../assets/img/icon-twitter.svg";
import mediaImg3 from "../../../assets/img/icon-instagram.svg";
import mediaImg4 from "../../../assets/img/icon-pinterest.svg";
import mediaImg5 from "../../../assets/img/icon-youtube.svg";
import PaymentImg from "../../../assets/img/payment-method.png";
import RazorPay from "../../../assets/img/razorpay.png";

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-red-400'>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Contact Information */}
          <div className='space-y-4'>
            <h1 className="text-2xl font-bold text-red-400">Fitza</h1>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-2">
              <p className="flex items-start">
                <span className="font-medium text-red-400 mr-2">Address:</span>
                <span>562 Wellington Road, Street 32, San Francisco</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium text-red-400 mr-2">Phone:</span>
                <span>+01 22222 3345 / +91 9999 3333</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium text-red-400 mr-2">Hours:</span>
                <span>10:00 - 18:00 Mon - Sat</span>
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Follow Us</h4>
              <div className='flex space-x-4'>
                {[mediaImg1, mediaImg2, mediaImg3, mediaImg4, mediaImg5].map((img, index) => (
                  <a 
                    href="#" 
                    key={index}
                    className="hover:bg-red-400 p-2 rounded-full transition-colors duration-300"
                  >
                    <img src={img} alt="Social media" className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Delivery Information', 'Privacy Policy', 'Terms & Conditions', 'Contact Us', 'Support Center'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-red-400 transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div className='space-y-4'>
            <h4 className="text-lg font-semibold text-white">My Account</h4>
            <ul className="space-y-2">
              {['Sign In', 'View Cart', 'My Wishlist', 'Track My Order', 'Help', 'Order History'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="hover:text-red-400 transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className='space-y-4'>
            <h4 className="text-lg font-semibold text-white">Secured Payment Gateways</h4>
            <img src={PaymentImg} alt="Payment methods" className="w-full max-w-xs bg-white p-2 rounded" />
            <img src={RazorPay} alt="Payment methods" className="w-full max-w-xs bg-white p-2 rounded" />
            <div className="pt-4">
              <h4 className="text-lg font-semibold text-white mb-2">Newsletter</h4>
              <p className="mb-3">Subscribe for updates and special offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 w-full rounded-l focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-900"
                />
                <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-r transition-colors duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Fitza. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;