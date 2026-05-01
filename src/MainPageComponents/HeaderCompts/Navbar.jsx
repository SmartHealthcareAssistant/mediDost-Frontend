import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import ShaLogo from "./ShaLogo";

import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Services from "./Services";
import FindDoctor from "../MainShowCompts/FindDoctor";

// ---------------------- DYNAMIC NAV LINK DATA -----------------------
const navItems = [
  {
    name: "Find Doctor",
    path: "/findDoctor",
    icon: <FaUserDoctor />,
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "About Us",
    path: "/about",
  },
  {
    name: "Contact Us",
    path: "/contact",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
     <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 ">
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* LEFT - LOGO */}
        <NavLink to="/" className="flex-shrink-0">
          <ShaLogo />
        </NavLink>

        {/* RIGHT SIDE - NAV + AUTH */}
        <div className="hidden lg:flex items-center gap-8 font-medium text-gray-700">

          {/* Navigation Links */}
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap transition duration-300
                ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "hover:text-blue-600"
                }`
              }
            >
              {item.name} {item.icon}
            </NavLink>
          ))}

          {/* Login */}
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
          >
            Login
          </NavLink>

          {/* Sign Up */}
          <NavLink
            to="/register"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow hover:underline"
          >
            Sign Up
          </NavLink>
        </div>

        {/* HAMBURGER FOR TABLET + MOBILE */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md border-t">
          <div className="flex flex-col gap-6 py-6 px-6 font-medium text-gray-700">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}

            <NavLink to="/login" onClick={() => setIsOpen(false)}>
              Login
            </NavLink>

            <NavLink to="/register" onClick={() => setIsOpen(false)}>
              Register
            </NavLink>
          </div>
        </div>
      )}
    </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/findDoctor" element={<FindDoctor />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
