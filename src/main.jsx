import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createHashRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import AllEvents from './Homepage/AllEvents.jsx'; 
import Home from "./Home.jsx"; 

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",      // Home page
        element: <Home />,
      },
      {
        path: "/all-events",   // All Events page
        element: <AllEvents />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);