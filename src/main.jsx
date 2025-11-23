import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminUI from './AdminUI.jsx'
import { createHashRouter, RouterProvider } from "react-router-dom";
import Homepage from './pages/homepage/index.jsx';
import EventDetails from './pages/eventdetails/index.jsx';
import About from './pages/about/index.jsx';
import CreateEvent from './pages/AdminPages/CreateEventPage/CreateEvent.jsx'
import EditEvent from './pages/AdminPages/EditEventPage/EditEvent.jsx'
import AdminLogin from './pages/AdminPages/LoginPage/AdminLogin.jsx'
import Dashboard from './pages/AdminPages/AdminDashboard/Dashboard.jsx'
import AttendancePage from './pages/AdminPages/AttendencesPage/AttendancePage.jsx'
import EventAttendanceListPage from './pages/AdminPages/AttendencesPage/EventAttendanceList.jsx'
import SubmitAttendancePage from './pages/SubmitAttendancePage/SubmitAttendancePage.jsx'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Homepage />,
        index: true,
      },
      {
        path: "/eventdetails/:eventId",
        element: <EventDetails />,
      },
      {
        path: "/about",
        element: <About/>,
      },
    ],
    //errorElement: <R404 />
  },
  {
    path: "/admin",
    element: <AdminUI />,
    children: [
      {
        path: "/admin",
        element: <Dashboard />
      },
      {
        path: "/admin/create",
        element: <CreateEvent />
      },
      {
        path: "/admin/edit/:eventId",
        element: <EditEvent />
      },
      {
        path: "/admin/attendance",
        element: <AttendancePage />
      },
      {
        path: "/admin/attendance/:eventId",
        element: <EventAttendanceListPage />
      },
    ]
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/submit-attendance/:qr_token",
    element: <SubmitAttendancePage />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
