import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;