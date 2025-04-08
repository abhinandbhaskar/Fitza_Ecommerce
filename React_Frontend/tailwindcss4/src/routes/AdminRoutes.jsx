import React from 'react'
import { Routes,Route } from "react-router-dom";
import DashboardPage from "../../src/pages/Admin/Dashboard/DashboardPage"
const AdminRoutes = () => {
  return (
    <>
      <Routes>
          <Route path="/dashboardpage" element={<DashboardPage />} />
      </Routes>  
    </>
  )
}

export default AdminRoutes
