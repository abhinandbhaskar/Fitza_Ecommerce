import React from 'react'
import "./ProductView.css"
import productImg1 from "../../assets/img/product-1-1.jpg";
import productImg2 from "../../assets/img/product-2-2.jpg";
import productImg3 from "../../assets/img/product-3-2.jpg";
import productImg4 from "../../assets/img/product-2-2.jpg";
const ProductView = () => {
  return (
    <div className='h-auto width-screen p-[20px] flex flex-row'>
      <div className="product-image h-[860px] w-[650px] bg-white border-1 border-gray-300 shadow-lg  flex flex-col justify-center items-center p-6 rounded-2xl gap-4">
        <div className='h-[560px] w-[100%] bg-white rounded-2xl flex items-center justify-center p-2'>
          <img src={productImg1} className='h-[540px] w-[540px]' alt="" />
        </div>
        <div className='h-[200px] w-[100%] p-1 flex flex-row gap-2 justify-center items-center'>
          <img src={productImg1} alt="" className='h-[140px] w-[140px] rounded-xl border-1 border-red-400' />
          <img src={productImg2} alt="" className='h-[140px] w-[140px] rounded-xl border-1 border-red-400' />
          <img src={productImg3} alt="" className='h-[140px] w-[140px] rounded-xl border-1 border-red-400' />
          <img src={productImg4} alt="" className='h-[140px] w-[140px] rounded-xl border-1 border-red-400' />
        </div>
    
      </div>
      <div className='w-[900px] h-auto p-2  bg-white border-1 border-gray-300 ml-[60px] rounded-2xl'>
        <div className='h-[260px] w-[100%] mb-4  bg-white border-1 border-gray-300 rounded-2xl gap-2 p-[38px]'>
          <h3 className='text-gray-700 text-3xl font-bold'>Men's Good looking tshirt for men Assorted Colors</h3>
          <h1 className='text-black font-extrabold text-6xl'> tshirt for men 

          </h1>
          <h2 className='text-6xl text-black font-bold'>₹105</h2>
          <h5 className='text-2xl'>Delivery ₹67 <strike>₹80</strike> </h5>

        </div>
        <div className='h-[220px] w-[100%]  bg-white border-1 border-gray-300 rounded-2xl mb-4 gap-2 p-[38px]'>
          <h3 className='text-3xl'>Select Size</h3>
          <div className='h-[100px]  bg-white border-1 border-gray-300 p-4 gap-4'>
            <button className='text-4xl px-6 py-3 bg-gray-400 rounded-full border-2 border-red-700 mr-4'>S</button>
            <button className='text-4xl px-6 py-3 bg-gray-400 rounded-full border-2 border-red-700 mr-4'>M</button>
            <button className='text-4xl px-6 py-3 bg-gray-400 rounded-full border-2 border-red-700 mr-4'>L</button>
            <button className='text-4xl px-6 py-3 bg-gray-400 rounded-full border-2 border-red-700 mr-4'>XL</button>
            <button className='text-4xl px-6 py-3 bg-gray-400 rounded-full border-2 border-red-700 mr-4'>XXL</button>
          </div>

        </div>
        <div className='h-[160px] w-[100%] rounded-2xl gap-2 p-[38px]'>

          <div className='h-[100px] bg-amber-600 p-4 gap-4'>
            <button className='text-4xl px-8 py-3 bg-gray-400 rounded-lg border-2 border-red-700 mr-4'> <i class="fa-solid fa-cart-shopping"></i> Add To Cart</button>
            <button className='text-4xl px-8 py-3 bg-gray-400 rounded-lg border-2 border-red-700 mr-4'>Buy Now</button>

          </div>

        </div>

<div className='h-auto w-[100%]  rounded-2xl gap-2 p-[38px]'>

<div className='h-auto bg-amber-600 p-4 gap-4'>
    <h4 className='text-3xl font-medium'>Product Details</h4>
    <ul>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
      <li className='text-xl'>Name : Men's Good looking tshirt for men Assorted Colors (random selection) </li>
    </ul>
</div>

</div>

<div className='h-auto w-[100%] rounded-2xl gap-2 p-[38px]'>

<div className='h-auto p-4 gap-4'>
    <h4 className='text-3xl font-medium'>Sold By</h4>
    <div className='h-[100px] w-[100%]  bg-white border-1 border-gray-300  mb-4 flex flex-row justify-center items-center gap-16'>
     <h2 className='text-3xl '>Shop Name</h2><h1 className='text-2xl'>rating</h1><button className='px-3 py-2 bg-amber-800 rounded-lg'>View Shop</button>
    </div>
    <div className='h-[50px] w-[100%] bg-white border-1 border-gray-300 p-2'>
      <h1 className='text-2xl text-gray-800'>Product Ratings & Reviews</h1>

    </div>
    <div className='h-[240px] w-[100%]  bg-white border-1 border-gray-300   mt-3 p-4'>
      <h1 className='text-2xl text-gray-800'>Customer Name</h1>
      <div className='flex flex-row  items-center bg-white '>
        <button className='px-2 py-2 rounded-full border-1 bg-amber-200 border-green-800'>5.0 <span className='text-2xl'>*</span></button>
        <h3>posted date:24/09/2023</h3>
      </div>
      <p className='text-lg'>so beautiful sarri i ever seen like this saree guys please buy it</p>
      <div className='flex flex-row gap-2 m-6 '>
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />

      </div>
    </div>

    <div className='h-[240px] w-[100%]  bg-white border-1 border-gray-300  mt-3 p-4'>
      <h1 className='text-2xl text-gray-800'>Customer Name</h1>
      <div className='flex flex-row  items-center bg-white '>
        <button className='px-2 py-2 rounded-full border-1 bg-amber-200 border-green-800'>5.0 <span className='text-2xl'>*</span></button>
        <h3>posted date:24/09/2023</h3>
      </div>
      <p className='text-lg'>so beautiful sarri i ever seen like this saree guys please buy it</p>
      <div className='flex flex-row gap-2 m-6 '>
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />
        <img src={productImg1} className='h-[80px] w-[80px] rounded-2xl' alt="" />

      </div>
    </div>

</div>

</div>
       

      </div>
    </div>
  )
}

export default ProductView














