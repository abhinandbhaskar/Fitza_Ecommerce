import React from "react";
import "./OffersSection.css";
import Img1 from "../../../assets/img/deals-1.jpg";
import Img2 from "../../../assets/img/deals-2.png";

const OffersSection = () => {
    return (
        <div className="Offers-section">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 middle-offers">
                <div className="offer-banner">
                    <img src={Img1} alt="" />

                    <div className="offer-Tags">
                        <h1>Deal of the Day</h1>
                        <p>Limited quantities.</p>
                        <h6>Summmer Collection New Modern Design</h6>
                        <h4>
                            $139.00{" "}
                            <span>
                                {" "}
                                <strike> $160.99</strike>
                            </span>
                        </h4>
                        <h5>Hurry Up! Offer End In:</h5>
                        <div className="Timer-section">
                            <div className="days">
                                <div>
                                    <h3>02</h3>
                                </div>
                                <p>Days</p>
                            </div>
                            <span>:</span>
                            <div className="hours">
                                <div>
                                    <h3>22</h3>
                                </div>
                                <p>Hours</p>
                            </div>
                            <span>:</span>
                            <div className="minutes">
                                <div>
                                    <h3>57</h3>
                                </div>
                                <p>Minutes</p>
                            </div>
                            <span>:</span>
                            <div className="seconds">
                                <div>
                                    <h3>24</h3>
                                </div>
                                <p>Sec</p>
                            </div>
                        </div>
                        <button className="h-[46px] w-[140px] bg-red-300 hover:bg-red-500 rounded-md" >Shop Now</button>
                    </div>
                </div>

                <div className="offer-banner">
                    <img src={Img2} alt="" />

                    <div className="offer-Tags">
                        <h1>Deal of the Day</h1>
                        <p>Limited quantities.</p>
                        <h6>Summmer Collection New Modern Design</h6>
                        <h4>
                            $139.00{" "}
                            <span>
                                {" "}
                                <strike> $160.99</strike>
                            </span>
                        </h4>
                        <h5>Hurry Up! Offer End In:</h5>
                        <div className="Timer-section">
                            <div className="days">
                                <div>
                                    <h3>02</h3>
                                </div>
                                <p>Days</p>
                            </div>
                            <span>:</span>
                            <div className="hours">
                                <div>
                                    <h3>22</h3>
                                </div>
                                <p>Hours</p>
                            </div>
                            <span>:</span>
                            <div className="minutes">
                                <div>
                                    <h3>57</h3>
                                </div>
                                <p>Minutes</p>
                            </div>
                            <span>:</span>
                            <div className="seconds">
                                <div>
                                    <h3>24</h3>
                                </div>
                                <p>Sec</p>
                            </div>
                        </div>
                        <button className="h-[46px] w-[140px] bg-red-300 hover:bg-red-500 rounded-md" >Shop Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffersSection;
