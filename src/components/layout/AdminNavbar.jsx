import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PrimaryButton from "../ui/button/PrimaryButton";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: "Events", path: "admin" },
        { label: "Attendances", path: "admin/attendance" },
        { label: "Announcements", path: "admin/announcements" },
    ];

    // 🧠 Close dropdown automatically when route changes (e.g. /register)
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Smooth scroll to section
    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Works across pages
    const handleNavigation = (id) => {
        if (location.pathname === "/") {
            // Already on home page — scroll only
            handleScroll(id);
        } else {
            // Go to home, then scroll after a short delay
            navigate(`/${id}`);
            setTimeout(() => handleScroll(id), 400);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/admin/login"); // Adjust to your actual login route
    };

    return (
        <>
            <nav
                className="w-full flex items-center justify-between self-stretch 
                   sticky top-0 z-9999 py-4 px-8
                   bg-white shadow-[0_1px_20px_0_rgba(0,0,0,0.07)]"
            >
                {/* Left logo */}
                <div id="left-content" className="flex items-center gap-[0.825rem]">
                    <Link to="/admin" className="flex items-center gap-[0.825rem]">
                        <img src="/PESKON2025_Logo.png" alt="Peskon Run Logo" className="h-7" />
                        <h1 className="hidden md:block text-black text-[1.2rem] md:text-[1.25rem] font-bold uppercase">
                            PESKON 2025 ADMIN CONSOLE
                        </h1>
                        <h1 className="md:hidden text-black text-[1.2rem] md:text-[1.25rem] font-bold uppercase">
                            ADMIN CONSOLE
                        </h1>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex justify-center items-center gap-6">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <button
                                onClick={() => handleNavigation(item.path)}
                                className="text-sm font-semibold text-gray-800 hover:text-peskon-primary cursor-pointer"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                    <button onClick={handleLogout} className="w-full inline-flex items-center justify-center gap-[0.5rem] rounded-full px-[1.25rem] py-[0.625rem] bg-transparent hover:bg-red-400 text-red-400 hover:text-white border border-red-400 text-sm cursor-pointer disabled:cursor-not-allowed">
                        Logout
                    </button>

                </ul>

                {/* Mobile Hamburger */}
                <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* ✅ Mobile Dropdown */}
            {isOpen && (
                <div className="sticky top-18 z-9999 md:hidden bg-white shadow-inner border border-peskon-primary/10 rounded-b-2xl">
                    <ul className="flex flex-col px-6 py-6 gap-8 items-center">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <button
                                    onClick={() => handleNavigation(item.path)}
                                    className="text-sm font-semibold text-gray-800 hover:text-peskon-primary"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                        <button onClick={handleLogout} className="w-full inline-flex items-center justify-center gap-[0.5rem] rounded-full px-[1.25rem] py-[0.625rem] bg-transparent hover:bg-red-400 text-red-400 hover:text-white border border-red-400 text-sm cursor-pointer disabled:cursor-not-allowed">
                            Logout
                        </button>
                    </ul>
                </div>
            )}
        </>
    );
};

export default Navbar;
