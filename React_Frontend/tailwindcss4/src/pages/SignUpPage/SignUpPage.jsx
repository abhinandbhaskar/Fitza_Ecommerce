import React, { useEffect, useState } from "react";
import "./SignUpPage.css";
import fitza from "../../assets/fitzaapp.png";
import { Link } from "react-router-dom";
import signupimg from "../../assets/signup.jpg";
import axios from "axios";

const SignUpPage = () => {
    const [animate, setAnimate] = useState(false);
    // register
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const handleRegister= async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);

        if(!fullname||!email||!phone||!password1||!password2){
            setError("All fileds are required.");
            setLoading(false);
            return;
        }
        if(password1!==password2){
            setError("passwords do not match.");
            setLoading(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            setError("Invalid email address.");
            setLoading(false);
            return;
        }
        if(phone.length<10){
            setError("Phone number must be at least 10 digits.");
            setLoading(false);
            return;
        }

        const registrationData={
            fullname:fullname.trim(),
            email:email.trim(),
            phone:phone.trim(),
            password1:password1.trim(),
            password2:password2.trim(),
        }
        console.log("Hello World",registrationData);
        try{
            const response = await axios.post("http://127.0.0.1:8000/api/register/",registrationData);
            console.log("201::",response.data)
            if(response.data)
            {
                alert(response.data.message);
                setFullname("");
                setEmail("");
                setPhone("");
                setPassword1("");
                setPassword2("");
               setTimeout(()=>{
                window.location.href="/login"
               },3000);
            }
        }
        catch(error){
            if(error.response&&error.response.data)
            {
                setError(error.response.data.detail||error.response.data.message||"An Error Occured during registration.")
            }
            else{
                setError("An Error occured please try again.")
            }
        }
        finally{
            setLoading(false);
        }
    }

    const [img, setImg] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setAnimate(true);
        }, 500);

        setTimeout(() => {
            setImg(true);
        }, 1000);
    }, []);
    return (
        <div className="h-screen w-full bg-white flex justify-center relative items-center ">
            <Link to={"/"}>
                <button className="absolute top-2 left-3 border-1 border-red-400 px-2  text-red-500 h-7 hover:font-bold hover:border-3 rounded-4xl flex items-center justify-center flex-row">
                    {" "}
                    <span>&lt;</span>Back
                </button>
            </Link>
           
            <form className="h-screen w-full bg-white flex justify-center  items-center" onSubmit={handleRegister}>
                <div className="h-screen w-full md:w-1/2  flex items-center justify-center flex-col gap-2 md:gap-5 rounded-4xl shadow-2xl">
                    <h1 className="text-4xl font-bold">SignUp</h1>
                    <input
                        type="text"
                        className="block w-10/14 md:w-1/2 sm:w-1/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Enter Your Fullname"
                        value={fullname}
                        onChange={(e)=>setFullname(e.target.value)}
                        aria-label="Fullname"
                        required
                    />
                    <input
                        type="text"
                        className="block w-10/14 md:w-1/2 sm:w-1/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Email Addresss"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        aria-label="Email Address"
                        required
                    />
                    <input
                        type="text"
                        className="block w-10/14 md:w-1/2 sm:w-1/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Mobile Number"
                        value={phone}
                        onChange={(e)=>setPhone(e.target.value)}
                        aria-label="Mobile Number"
                        required
                    />
                    <input
                        type="text"
                        className="block w-10/14 md:w-1/2 sm:w-1/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Enter Password"
                        value={password1}
                        onChange={(e)=>setPassword1(e.target.value)}
                        aria-label="Password"
                        required
                    />
                    <input
                        type="text"
                        className="block w-10/14 md:w-1/2 sm:w-1/3 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Re-Enter Password"
                        value={password2}
                        onChange={(e)=>setPassword2(e.target.value)}
                        aria-label="Re-Enter Password"
                        required
                    />
                    <button
                    type="submit"
                    disabled={loading}
                    className={`bg-red-400 hover:bg-red-500 px-5 py-1 md:px-7 md:py-2 text-white font-bold text-xl rounded-full ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    >
                    {loading ? "Submitting..." : "Sign Up"}
                    </button>

                    {error && <p className="text-red-500"> {error} </p>}
                    <p>or continue with</p>
                    {/* <a href="{% url 'social:begin' 'google-oauth2' %}?next={{ request.GET.next|urlencode }}" className="flex items-center justify-center w-[200px] px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i className="fa-brands fa-google p-2"></i>
                        Continue with Google
                    </a> */}
<a
  href="http://localhost:8000/social/login/google-oauth2/"
  className="flex items-center justify-center w-[200px] px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  <i className="fa-brands fa-google p-2"></i>
  Continue with Google
</a>



                    
                    <h4>
                        Already have an account?{" "}
                        <Link to={"/login"}>
                            <span className="text-blue-900 font-bold">Sign in</span>
                        </Link>
                    </h4>
                </div>
            </form>

            <div className="welcome-container h-screen w-1/3 flex justify-center flex-col items-center">
                <div className="flex w-[70%] flex-row py-2 items-center">
                    <img src={fitza} className="h-24 w-24" alt="" />
                    <h1 className="text-4xl font-bold p-1 text-gray-800">Welcome to Fitza!</h1>
                </div>
                <div className="flex w-[70%] flex-row py-1  items-center">
                    <p className="text-gray-600">
                        Discover the latest trends in fashion and find your perfect look. Let's get started on your style
                        journey today!{" "}
                    </p>
                </div>
{
    img&&(
        <img
        src={signupimg}
        className={`rounded-2xl shadow-2xl mr-[320px] transform transition-transform duration-1000  ${
            animate ? "translate-x-56" : ""
        }`}
        alt=""
    />
    )
}
            </div>
        </div>
    );
};

export default SignUpPage;
