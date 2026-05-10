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

// ---------------------- NAV ITEMS -----------------------
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
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">

        {/* MAIN CONTAINER */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">

          {/* LOGO */}
          <NavLink to="/" className="flex-shrink-0">
            <ShaLogo />
          </NavLink>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700">

            {/* NAV LINKS */}
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 whitespace-nowrap transition-all duration-300 pb-1
                  ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "hover:text-blue-600"
                  }`
                }
              >
                {item.name}
                {item.icon}
              </NavLink>
            ))}

            {/* LOGIN BUTTON */}
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition duration-300"
            >
              Login
            </NavLink>

            {/* REGISTER BUTTON */}
            <NavLink
              to="/register"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Sign Up
            </NavLink>
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            className="lg:hidden text-2xl text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* ================= MOBILE + TABLET MENU ================= */}
        <div
          className={`
            lg:hidden overflow-hidden transition-all duration-300
            ${
              isOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div className="bg-white/95 backdrop-blur-md border-t shadow-lg rounded-b-2xl">

            <div className="flex flex-col px-4 py-4 gap-2 font-medium text-gray-700">

              {/* MOBILE NAV LINKS */}
              {navItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}

              {/* AUTH BUTTONS */}
              <div className="flex flex-col gap-2 pt-3">

                {/* LOGIN */}
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="
                    w-full text-center
                    px-4 py-2.5
                    rounded-xl
                    border border-gray-300
                    hover:bg-gray-100
                    transition
                    font-medium
                  "
                >
                  Login
                </NavLink>

                {/* REGISTER */}
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="
                    w-full text-center
                    px-4 py-2.5
                    rounded-xl
                    bg-blue-600 text-white
                    hover:bg-blue-700
                    transition
                    font-medium
                    shadow-md
                  "
                >
                  Register
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= ROUTES ================= */}
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