import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminUI from './AdminUI.jsx'
import { createHashRouter, RouterProvider } from "react-router-dom";
import Homepage from './pages/homepage/index.jsx';
import EventDetails from './pages/eventdetails/index.jsx';
import CreateEvent from './pages/createEventPage/CreateEvent.jsx'
import EditEvent from './pages/EditEventPage/EditEvent.jsx'
import AdminLogin from './pages/AdminDashboard/AdminLogin.jsx'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/eventdetails/:eventId",
        element: <EventDetails />,
      },
    ],
    //errorElement: <R404 />
  },
  {
    path: "/admin",
    element: <AdminUI />
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/create",
    element: <CreateEvent />
  },
  {
    path: "/admin/edit/:eventId",
    element: <EditEvent />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
