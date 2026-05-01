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
    { icon: <FaFacebookF size={18} />, url: "#", color: "hover:bg-blue-600" },
    { icon: <FaSquareXTwitter size={18} />, url: "#", color: "hover:bg-blue-600" },
    { icon: <FaLinkedinIn size={18} />, url: "#", color: "hover:bg-blue-700" },
    { icon: <FaInstagram size={18} />, url: "#", color: "hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" },
  ];

  return (
    <footer className="bg-blue-900 shadow-md text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-5 gap-8">
        
        {/* Logo and About */}
        <div>
          <div className="font-medium text-white bg-white"><ShaLogo /></div>
          <p className="mt-3 text-sm">
            MediDost to connect Patients, Doctors, and Providers with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="pl-6">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {quickLinks.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className="text-white hover:underline">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white">Services</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {services.map((service, index) => (
              <li key={index} className="cursor-pointer text-white hover:underline">
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* More Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">More</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {moreLinks.map((item, index) => (
              <li key={index} className="cursor-pointer text-white hover:underline">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4 mt-3">
            {socialLinks.map((s, index) => (
              <a
                key={index}
                href={s.url}
                className={`p-2 bg-black rounded-full hover:text-white ${s.color}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 mt-12 py-4 text-center text-sm text-white">
        Copyright© {new Date().getFullYear()} 
        {" "} MediDost. All Rights Reserved.
      </div>
    </footer>
  );
}
