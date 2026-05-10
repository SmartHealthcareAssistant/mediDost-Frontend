import React from "react";
import ShaLogo from "../HeaderCompts/ShaLogo";
import { Link } from "react-router-dom";

import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Footer() {
  // ---------------- DYNAMIC DATA ----------------

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    "Appointment Scheduling",
    "Personalized Care Plans",
    "Doctor Consultation",
    "Healthcare Provider Support",
  ];

  const moreLinks = [
    "Help",
    "Developer",
    "Privacy Policy",
    "Terms & Conditions",
  ];

  const socialLinks = [
    {
      icon: <FaFacebookF size={18} />,
      url: "#",
      color: "hover:bg-blue-600",
    },
    {
      icon: <FaSquareXTwitter size={18} />,
      url: "#",
      color: "hover:bg-blue-600",
    },
    {
      icon: <FaLinkedinIn size={18} />,
      url: "#",
      color: "hover:bg-blue-700",
    },
    {
      icon: <FaInstagram size={18} />,
      url: "#",
      color:
        "hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    },
  ];

  return (
    <footer className="bg-blue-900 shadow-md text-white mt-auto">
      
      {/* ================= MAIN FOOTER ================= */}
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          py-10
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-5
          gap-10
        "
      >
        {/* ================= LOGO + ABOUT ================= */}
        <div className="sm:col-span-2 lg:col-span-1">

          {/* LOGO BOX */}
          <div
            className="
              inline-flex
              items-center
              justify-center
              bg-white
              rounded-xl
              px-3 py-2
              max-w-[220px]
              overflow-hidden
            "
          >
            <div className="scale-85 sm:scale-90 origin-left">
              <ShaLogo />
            </div>
          </div>

          {/* ABOUT TEXT */}
          <p className="mt-4 text-sm leading-6 text-gray-200 max-w-xs">
            MediDost to connect Patients, Doctors, and Providers with ease.
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            {quickLinks.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="text-gray-200 hover:text-white hover:underline transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ================= SERVICES ================= */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Services
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            {services.map((service, index) => (
              <li
                key={index}
                className="cursor-pointer text-gray-200 hover:text-white hover:underline transition"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* ================= MORE LINKS ================= */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            More
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            {moreLinks.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer text-gray-200 hover:text-white hover:underline transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ================= SOCIAL MEDIA ================= */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            Follow Us
          </h3>

          <div className="flex flex-wrap gap-3 mt-4">
            {socialLinks.map((s, index) => (
              <a
                key={index}
                href={s.url}
                className={`
                  p-3 rounded-full bg-black
                  transition-all duration-300
                  hover:scale-110 hover:text-white
                  ${s.color}
                `}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div
        className="
          border-t border-white/20
          py-4
          px-4
          text-center
          text-xs sm:text-sm
          text-gray-200
        "
      >
        Copyright© {new Date().getFullYear()} MediDost.
        {" "}All Rights Reserved.
      </div>
    </footer>
  );
}