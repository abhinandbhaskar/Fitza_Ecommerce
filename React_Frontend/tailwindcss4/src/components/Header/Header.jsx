import React, { useEffect, useState } from "react";
import "./Header.css";
import Logo from "../../assets/Logo/Fitza_logo.png";
import { Link } from "react-router-dom";
import { useSelector} from "react-redux";

const Header = () => {
    const[shop,setShop]=useState(false);
    const[category,setCategory]=useState(false);
    const[offers,setOffers]=useState(false);
    const[compare,setCompare]=useState(false);
    const { isAuthenticated,userId } = useSelector((state) => state.auth);
    useEffect(() => {
        console.log("Redux Auth Updated:", isAuthenticated);
    }, [isAuthenticated]);
    
    return (
        <header className="w-full relative">
            <div className="header-top bg-red-300 h-8 w-full flex items-center">
                <div className="md:ml-4 ml-2 flex space-x-2">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-square-facebook p-2 text-white text-sm md:text-base"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-square-x-twitter p-2 text-white text-sm md:text-base"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-square-instagram p-2 text-white text-sm md:text-base"></i>
                    </a>
                </div>
            </div>

            <div className="header-main h-auto md:h-[100px] w-full border border-red-200 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4">
                <div>
                    <a href="#">
                        <img
                            src={Logo}
                            className="h-[40px] w-[100px] md:h-[80px] md:w-[140px] object-contain"
                            alt="Logo"
                        />
                    </a>
                </div>
                <div className="flex items-center w-full md:w-[460px] lg:w-[600px] py-2 rounded-md border border-red-300 bg-white shadow-sm mt-4 md:mt-0">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="form-control flex-grow px-4 py-2 outline-none text-gray-600 text-sm md:text-base"
                    />
                    <i className="fa fa-search text-gray-400 mx-3 text-sm md:text-base"></i>
                </div>

                <div className="flex justify-center items-center space-x-4 mt-4 md:mt-0 md:space-x-6">
                    <Link to={isAuthenticated?"/profile":"/login"}><i className="fa-regular fa-user text-red-400 text-xl md:text-3xl"></i></Link>
                    <i className="fa-regular fa-heart text-red-400 text-xl md:text-3xl"></i>
                    <i className="fa-solid fa-bag-shopping text-red-400 text-xl md:text-3xl"></i>
                </div>
            </div>

            <div className="header-bottom h-auto w-full flex justify-center mb-2">
                <div className="w-full max-w-screen-lg flex flex-wrap justify-center items-center space-x-2">
                    <button  className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        HOME
                    </button>
                    <button onMouseEnter={()=>setShop(true)} onMouseLeave={()=>setShop(false)}   className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        SHOP
                    </button>
                    <button onMouseEnter={()=>setCategory(true)} onMouseLeave={()=>setCategory(false)} className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        CATEGORIES
                    </button>
                    <button onMouseEnter={()=>setOffers(true)} onMouseLeave={()=>setOffers(false)} className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        OFFERS
                    </button>
                    <button onMouseEnter={()=>setCompare(true)} onMouseLeave={()=>setCompare(false)} className="py-2 px-4 text-sm md:text-base mx-1 border-b-2 border-transparent hover:border-red-300 transition-all duration-200">
                        COMPARE
                    </button>
                </div>
            </div>

            
{
    shop || category || offers || compare ? (<div className={`h-auto w-1/2 bg-white top-[180px] left-[460px] absolute p-2 flex-row grid lg:grid-cols-3 gap-1 
        transition-opacity duration-[2000] ${shop || category || offers || compare ? "opacity-100" : "opacity-0"}`} >
    <div className="h-auto w-[100%] bg-amber-500 rounded-md px-4 py-2">
        <h1 className="p-1">Options1</h1>
        <ul>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
        </ul>
    </div>
    <div className="h-auto w-[100%] bg-amber-500 px-4 py-2">
        <h1 className="p-1">Options1</h1>
        <ul>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
        </ul>
    </div>
    <div className="h-auto w-[100%] bg-amber-500 px-4 py-2">
        <h1 className="p-1">Options1</h1>
        <ul>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
        </ul>
    </div>
    <div className="h-auto w-[100%] bg-amber-500 px-4 py-2">
        <h1 className="p-1">Options1</h1>
        <ul>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
            <li>Computer Care</li>
        </ul>
    </div>
</div>) : null

}


        </header>
    );
};

export default Header;
