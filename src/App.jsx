import './App.css'
import { useState } from 'react';
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    console.log("Clicked");

  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        <div className="flex flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
