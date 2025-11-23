import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createHashRouter, RouterProvider } from "react-router-dom";
import Homepage from './pages/homepage/index.jsx';
import EventDetails from './pages/eventdetails/index.jsx';
import About from './pages/about/index.jsx';

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
      {
        path: "/about",
        element: <About/>,
      },
    ],
    //errorElement: <R404 />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
