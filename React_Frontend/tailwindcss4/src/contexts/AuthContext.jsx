// import React,{createContext,useState,useEffect} from "react";

// export const AuthContext=createContext();

// export const AuthProvider = ({children})=>{
//     const[isAuthenticated,setIsAuthenticated]=useState(false);

//     useEffect(()=>{
//         const token = localStorage.getItem("accessToken");
//         setIsAuthenticated(!!token);
//     },[]);
//     const logout = () => {
//         // Call the backend to clear the session
//         fetch('http://localhost:8000/clear-session/', {
//             method: 'POST',
//             credentials: 'include', // Required to include cookies for the session
//             headers: {
//                 'Content-Type': 'application/json', // Specify JSON if needed
//             },
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 console.log(data.message); // Log success message
//             })
//             .catch((error) => {
//                 console.error('Error clearing session:', error);
//             })
//             .finally(() => {
//                 // Clear tokens from localStorage and update state
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 setIsAuthenticated(false);
//                 window.location.href = "/";
//             });
//     };
    
//     return(
//         <AuthContext.Provider value={{isAuthenticated,logout,setIsAuthenticated}}>
//             {children}
//         </AuthContext.Provider>
//     )

// }


