import React from 'react'
import { Routes,Route } from "react-router-dom";
import DashboardPage from "../pages/Admin/DashboardPage/DashboardPage"
import LoginPage from '../pages/Admin/LoginPage/LoginPage';
import ViewSellerPage from '../pages/Admin/ViewSellerPage/ViewSellerPage';
const AdminRoutes = () => {
  return (
    <>
      <Routes>
          <Route path="/dashboardpage" element={<DashboardPage/>} />
          <Route path="/adminlogin" element={<LoginPage/>} />
          <Route path="/viewseller/:id" element={<ViewSellerPage/>} />
      </Routes>  
    </>
  )
}

export default AdminRoutes
