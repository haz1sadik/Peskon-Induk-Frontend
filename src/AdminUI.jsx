import React, { useEffect } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import Dashboard from './pages/AdminPages/AdminDashboard/Dashboard.jsx';
import AdminNavbar from './components/layout/AdminNavbar.jsx'
import AdminFooter from './components/layout/AdminFooter.jsx'
import axios from './axios.js'

const AdminUI = () => {

  const navigate = useNavigate();

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        await axios.get('/api/admin/admins', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/admin/login');
        }
        document.title = "PESKON 2025 Admin Console"
      }
    }
    checkLoggedIn();
  }, [])
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