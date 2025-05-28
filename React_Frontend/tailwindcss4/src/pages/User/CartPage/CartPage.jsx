import React, { useState } from "react";
import Header from "../../../components/User/Header/Header";
import Footer from "../../../components/User/Footer/Footer";
import CartSection from "../../../components/User/CartComponents/CartSection/CartSection";
import AddressSection from "../../../components/User/CartComponents/AddressSection/AddressSection";
import PaymentSection from "../../../components/User/CartComponents/PaymentSection/PaymentSection";
import ErrorBoundary from "../../../components/ErrorBoundary";
const CartPage = ({countsN}) => {
    const[cartView,setCartView]=useState("cart");
    const[cartId,setCartId]=useState(null);


  return (
    <>
      <Header countsN={countsN} />
      <div className="min-h-screen bg-gray-50">
        {/* Progress Bar */}
        <div className="flex items-center justify-center py-4 bg-white shadow-md">
        <div className="flex flex-col">
        <button className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
            1
          </button>
          <p className="text-sm text-gray-600">cart</p>
        </div>
          <span className="mx-4 text-gray-400">------------</span>
          <div className="flex flex-col">
          <button className="h-8 w-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
            2
          </button>
          <p className="text-sm text-gray-600">address</p>
          </div>
          <span className="mx-4 text-gray-400">------------</span>
          <div className="flex flex-col">
          <button className="h-8 w-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
            3
          </button>
          <p className="text-sm text-gray-600">payment</p>
          </div>
        </div>
        {cartView==="cart" && (
            <CartSection setCartView={setCartView} setCartId={setCartId}/>
        )}

        {
            cartView==="address"&&(
              
                  <AddressSection cartId={cartId} setCartView={setCartView}/>
                
                
            )
        }
                {
            cartView==="payment"&&(
              <ErrorBoundary>
                <PaymentSection cartId={cartId} setCartId={setCartId}/>
              </ErrorBoundary>
                
            )
        }



      </div>
      <Footer />
    </>
  );
};

export default CartPage;
