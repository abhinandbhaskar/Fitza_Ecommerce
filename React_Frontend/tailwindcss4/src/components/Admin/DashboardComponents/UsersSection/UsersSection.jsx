import axios from "axios";
import React, { useEffect,useState } from "react";
import { useSelector } from "react-redux";

const UsersSection = () => {
    const { accessToken }=useSelector((state)=>state.auth);
    const [users, setUsers]=useState([]);
    const [loading, setLoading]=useState(true);
 
    // const fetchUsers=async()=>{
        
    //     console.log(accessToken);
    //     try{
    //         const response=await fetch("https://127.0.0.1:8000/api/admin/view_users/",{
    //             method:"GET",
    //             headers:{
    //                 Authorization:`Bearer ${accessToken}`,
    //             }
    //         })
    //         if(response.ok)
    //         {
    //             const data=await response.json();
    //             console.log("Kitti",data);
    //             setUsers(data);
    //         }
    //         else{
    //             console.log("Error Occured");
    //         }
    //     }
    //     catch(errors)
    //     {
    //         console.log(errors);
    //         console.log(errors.response.data);
    //     }
    //     finally{
    //         console.log("Completed...")
    //         setLoading(false);
    //     }
    // }

    const fetchUsers = async () => {
        setLoading(true); // Ensure loading state is properly managed
        try {
           
            const response = await axios.get("https://127.0.0.1:8000/api/admin/view_users/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.status === 200) {
                console.log("Fetched Users:", response.data);
                setUsers(response.data);
            } else {
                console.log("Error Occurred");
            }
        } catch (errors) {
            console.log(errors);
            if (errors.response) {
                console.log(errors.response.data);
            }
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(()=>{
        console.log("Start...");
    fetchUsers();
    },[])

    const RemoveUser=async(user_id)=>{
        try{
            console.log("Yes Get Token",accessToken);
            const response=await axios.post(`https://127.0.0.1:8000/api/admin/remove_users/${user_id}/`,{},{
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
            });
            if(response.status===200){
                console.log("User removed successfully");
                fetchUsers(); // Refresh the user list
            }
            else{
                console.log("Error occurred while removing the user");
            }
        }
        catch(errors)
        {
            console.log(errors);
            console.log(errors.response.data);
        }
        finally{
            console.log("Removedd...");
        }
      
    }

    const handleRemove = (user_id)=>{
        if(window.confirm("Are you sure you want to remove this user?"))
        {
            RemoveUser(user_id);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    Dashboard &gt; <span className="text-indigo-600">Users</span>
                </h1>
            </div>

            {/* Table Container */}
            <div className="p-6">
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            {
                loading ? (
                    <p className="text-center text-gray-600 py-4">Loading users...</p>
                ):(
                    <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Account Status</th>
                            <th>Registration Date</th>
                            <th>Last Login</th>
                            <th>Total Orders</th>
                            <th>Remove User</th>
                        </tr>
                    </thead>
                        <tbody>
                    {
                        users.length > 0 ?
                        (
                            
                            users.map((users)=>(
                                <tr key={users.id} className="hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {users.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {users.full_name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {users.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {users.phone}
                                </td>
                                <td className={`px-6 py-4 text-sm text-green-600 font-semibold border-b border-gray-300 ${users.is_active?"text-green-600":"text-red-600"}`}>

                                    {users.is_active ? "Active":"Inactive"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {users.date_joined}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    {users.last_login}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-300">
                                    7
                                </td>
                                <td className="px-6 py-4 text-sm border-b border-gray-300">
                                    <button onClick={()=>handleRemove(users.id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                            ))
                            
                        ):(
                            <tr>
                            <td
                                colSpan="9"
                                className="text-center px-6 py-4 text-sm text-gray-600 border-b border-gray-300"
                            >
                                No users found.
                            </td>
                        </tr>
                        )
                    }
                        </tbody>
                    </table>
                )
            }
                </div>
            </div>
        </div>
    );
};

export default UsersSection;

