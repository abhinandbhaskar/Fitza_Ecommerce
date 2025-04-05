import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import fitza from "../../assets/fitzaapp.png";
import signupimg from "../../assets/signup.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
const LoginPage = () => {
    const [animate, setAnimate] = useState(false);
    const [img, setImg] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch=useDispatch();
    const { isAuthenticated,accessToken } = useSelector((state) => state.auth);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        const loginData={
            username:email.trim(),
            password:password.trim(),
        }
        try{
            const response=await axios.post("http://127.0.0.1:8000/api/login/",loginData,{
                headers:{
                    "Content-Type":"application/json",
                  },
                  withCredentials: true,
            });
            console.log("Accbb",response.data.access);
            dispatch(
                loginSuccess({
                    accessToken: response.data.access, // Include access token
                })
            );
            setTimeout(()=>{
             window.location.href="/";
            },10000);
        }
        catch(error)
        {
            if(error)
            {
                setError(error.response.data);
                console.log("ERRRoRRRR",error.response.data);
            }
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        setAnimate(true);
        setTimeout(() => {
            setImg(true);
        }, 500);
    }, []);
    return (
        <div className="h-screen w-full bg-white flex justify-center relative items-center ">
            <Link to={"/"}>
                <button className="absolute top-2 left-3 border-1 border-red-400 px-2  text-red-500 h-7 hover:font-bold hover:border-3 rounded-4xl flex items-center justify-center flex-row">
                    {" "}
                    <span>&lt;</span>Back
                </button>
            </Link>
            <div className="h-screen w-full md:w-1/2  flex items-center justify-center flex-col gap-2 md:gap-5 rounded-4xl shadow-2xl">
                <h1 className="text-4xl font-bold">SignIn</h1>
                <form onSubmit={handleSubmit} className="h-auto w-auto md:w-1/2  flex items-center justify-center flex-col gap-2 md:gap-5 ">
                    <input
                        type="text"
                        className="block w-10/14 md:w-1/2 sm:w-1/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Email Addresss"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="block w-10/14 md:w-1/2 sm:w-1/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                      <button onClick={()=>dispatch(loginSuccess())} className="px-2 py-1 bg-blue-600 hover:bg-blue-800 rounded-xl">Clickk</button>
                    <button className="bg-red-400 hover:bg-red-500 px-5 py-1 md:px-7 md:py-2 text-white font-bold text-xl rounded-full">
                        {loading ?"Logging In...":"Login"}
                    </button>
                    <a className="text-blue-800 font-bold" href="http://127.0.0.1:8000/password-reset/">Forgot Password?</a>

                    <h4>
                        Don't have an account?
                        <Link to={"/signup"}>
                            <span className="text-blue-900 font-bold">Sign up</span>
                        </Link>
                    </h4>
                </form>
            </div>
            <div className="welcome-container h-screen w-1/3 flex justify-center flex-col items-center">
                <div className="flex w-[80%] flex-row py-2 items-center">
                    <img src={fitza} className="h-24 w-24" alt="" />
                    <h1 className="text-4xl font-bold p-1 text-gray-800">Welcome Back!</h1>
                </div>
                <img
                    src={img ? signupimg : ""}
                    className={`rounded-2xl shadow-2xl mr-[320px] transform transition-transform duration-1000  ${
                        animate ? "translate-x-56" : ""
                    }`}
                    alt=""
                />
            </div>
        </div>
    );
};

export default LoginPage;
