import React from 'react'
import "./TopRelease.css"
import productImg1 from "../../../assets/img/product-1-1.jpg";
import productImg2 from "../../../assets/img/product-2-2.jpg";
import productImg3 from "../../../assets/img/product-3-2.jpg";
import productImg4 from "../../../assets/img/product-9-2.jpg";
import productImg5 from "../../../assets/img/product-6-1.jpg";
import productImg6 from "../../../assets/img/product-7-2.jpg";
import productImg7 from "../../../assets/img/product-3-2.jpg";
import productImg8 from "../../../assets/img/product-2-2.jpg";
import productImg9 from "../../../assets/img/product-4-1.jpg";
import productImg10 from "../../../assets/img/product-9-1.jpg";
import productImg11 from "../../../assets/img/product-8-2.jpg";
import productImg12 from "../../../assets/img/product-10-2.jpg";

const TopRelease = () => {
  return (
    <div className="TopSelling-section">
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 g-3 sell-Details">
        <div className="top-nav">
            <div className="nav-head">
                <h5>Hot Releases</h5>
                <div className="horizontal-line"></div>
            </div>

            <div className=" g-3 ">
                <div className="">
                    <div className="card TopSelling-Cards">
                        <img src={productImg1} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg2} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg3} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="top-nav ">
            <div className="nav-head">
                <h5>Hot Releases</h5>
                <div className="horizontal-line"></div>
            </div>

            <div className=" g-3 ">
                <div className="">
                    <div className="card TopSelling-Cards">
                        <img src={productImg4} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg5} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg6} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="top-nav">
            <div className="nav-head">
                <h5>Hot Releases</h5>
                <div className="horizontal-line"></div>
            </div>

            <div className=" g-3 ">
                <div className="">
                    <div className="card TopSelling-Cards">
                        <img src={productImg7} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg8} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg9} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="top-nav">
            <div className="nav-head">
                <h5>Hot Releases</h5>
                <div className="horizontal-line"></div>
            </div>

            <div className=" g-3 ">
                <div className="">
                    <div className="card TopSelling-Cards">
                        <img src={productImg10} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg11} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>

                    <div className="card TopSelling-Cards">
                    <img src={productImg12} className="ProductImgs" alt="" />
                        <div className="product-details">
                            <h3>Flora Print Casual Cotton</h3>
                            <h4>$238.85 <span><strike>$245.8</strike></span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</div>
  )
}

export default TopRelease
