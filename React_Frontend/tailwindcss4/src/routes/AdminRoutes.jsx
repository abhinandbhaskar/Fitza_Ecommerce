import React from 'react'
import { Routes,Route } from "react-router-dom";
import DashboardPage from "../pages/Admin/DashboardPage/DashboardPage"
import LoginPage from '../pages/Admin/LoginPage/LoginPage';
const AdminRoutes = () => {
  return (
    <>
      <Routes>
          <Route path="/dashboardpage" element={<DashboardPage/>} />
          <Route path="/adminlogin" element={<LoginPage/>} />
      </Routes>  
    </>
  )
}

export default AdminRoutes
