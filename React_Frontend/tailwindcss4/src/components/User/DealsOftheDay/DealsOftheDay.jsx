import React from 'react'
import "./DealsOftheDay.css"
import categoryImg1 from "../../../assets/img/category-1.jpg";
import categoryImg2 from "../../../assets/img/category-2.jpg";
import categoryImg3 from "../../../assets/img/category-3.jpg";
import categoryImg4 from "../../../assets/img/category-4.jpg";
import categoryImg5 from "../../../assets/img/category-5.jpg";
import categoryImg6 from "../../../assets/img/category-6.jpg";
const DealsOftheDay = () => {
  return (
    <div className='deals-section'>
        <div className="deals-nav">
            <h1><span>Deals Of The Day </span>With Extra Discount</h1>
            <div className='dealsnav-btn'>
              <button> &lt; </button>
              <button> &gt; </button>
            </div>
        </div>

        <div className='h-[200px] w-full flex justify-center'>
            <div className='h-[200px] w-[60%] flex justify-center items-center'>
                <h2 className='flex py-4 font-bold text-2xl'>Deals Ends In</h2>
                <div className='h-16 px-4 w-[120px] bg-orange-300 p-6 flex items-center justify-center rounded-md'><span className='text-orange-600 font-bold text-2xl'>01 h</span></div><span className='flex py-4 font-bold text-2xl'>:</span>
                <div className='h-16 px-4 w-[120px] bg-orange-300 p-6 flex items-center justify-center rounded-md'><span className='text-orange-600 font-bold text-2xl'>01 h</span></div><span className='flex py-4 font-bold text-2xl'>:</span>
                <div className='h-16 px-4 w-[120px] bg-orange-300 p-6 flex items-center justify-center rounded-md'><span className='text-orange-600 font-bold text-2xl'>01 h</span></div>

            </div>
        </div>
       
        <div className="popular-cards">
              {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-3 cards"> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 cards">
              
                    <div className="card m-3">
                
                      <img src={categoryImg1} className="card-img-top dim-image" alt="Card Image" />
                      <div className="card-body">
                        <h5 className="card-title">T - Shirt</h5>
                      </div>
                    </div>
                 

                
                    <div className="card  m-3">
                
                      <img src={categoryImg2} className="card-img-top dim-image" alt="Card Image" />
                      <div className="card-body">
                        <h5 className="card-title">Bags</h5>
                      </div>
                    </div>
                

                 
                    <div className="card  m-3">
                
                      <img src={categoryImg3} className="card-img-top dim-image" alt="Card Image" />
                      <div className="card-body">
                        <h5 className="card-title">Sandal</h5>
                      </div>
                    </div>
                 

               
                    <div className="card  m-3">
                
                      <img src={categoryImg4} className="card-img-top dim-image" alt="Card Image" />
                      <div className="card-body">
                        <h5 className="card-title">Scarf Cap</h5>
                      </div>
                    </div>
                

                    <div className="card  m-3">
                
                      <img src={categoryImg5} className="card-img-top dim-image" alt="Card Image" />
                      <div className="card-body">
                        <h5 className="card-title">Shoes</h5>
                      </div>
                    </div>
                

              
                    <div className="card  m-3">
                      <img src={categoryImg6} className="card-img-top dim-image" alt="Card Image" />
                      <div className="card-body">
                        <h5 className="card-title">Pillow</h5>
                      </div>
                    </div>
              


              </div>
        </div>
    </div>
  )
}

export default DealsOftheDay
