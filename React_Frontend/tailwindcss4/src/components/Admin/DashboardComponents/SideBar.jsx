import React from 'react'
import dashboardicon from "../../../assets/dashboard.png"
const SideBar = () => {
  return (
    <div className='h-screen w-2/10 bg-gray-800 '>
      <button className='bg-gray-800 py-3  w-full text-2xl text-bold flex justify-between'> <img src={dashboardicon} className='h-8 w-8 mx-2' alt="" /><h1>Dashboard</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-user px-4"></i> <h1>Users</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Sellers</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Products</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Orders</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Revenue</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Messages</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Complients</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Reviews</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Feedback</h1><h1 className='px-4'> &lt;</h1></button>
      <button className='bg-blue-600 py-3  w-full text-2xl text-bold flex justify-between'> <i className="fa-solid fa-bell px-4"></i> <h1>Refund & Returns</h1><h1 className='px-4'> &lt;</h1></button>
    </div>
  )
}

export default SideBar
