import {logout} from "./authSlice";

export const logoutUser=()=>async (dispatch)=>{
    try{
        const response=await fetch('http://localhost:8000/clear-session/',{
            method:'POST',
            credentials:'include',
            headers:{
                'Content-Type':'application/json',
            },
        });
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data=await response.json();
        console.log(data.message);
    }
    catch(error){
        console.error('Error clearing session:', error);
    }
    
    finally{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log("Deyyyyyyyyyyyyyyyyyyyyyyyyyy");
        dispatch(logout({
            userId : null,
            accessToken : null,
            isAuthenticated : false,
        }));
        window.location.href="/";
    }
};