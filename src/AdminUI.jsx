import React from 'react'
import { Outlet } from "react-router-dom";
import Dashboard from './pages/AdminPages/AdminDashboard/Dashboard.jsx';
import AdminNavbar from './components/layout/AdminNavbar.jsx'
import AdminFooter from './components/layout/AdminFooter.jsx'

const AdminUI = () => {
  return (
    <>
      <div className="flex flex-col w-full min-h-screen">
        <AdminNavbar />
        <div className="flex flex-grow">
          <Outlet />
        </div>
        <AdminFooter />
      </div>

    </>
    
  )
}

export default AdminUI