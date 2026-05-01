import { useState } from "react";
import { Menu, X } from "lucide-react"; // install: npm install lucide-react

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

 const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "appointments", label: "Appointments" },
  { key: "patients", label: "Patient Details" },
  { key: "prescriptions", label: "Prescriptions" }, // NEW
  { key: "profile", label: "Profile" },
];

  return (
    <>
      {/* Top Navbar - only for mobile */}
      <div className="md:hidden bg-blue-600 text-white shadow p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Doctor Portal</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Sidebar - visible on desktop, sliding drawer on mobile */}
      <div
        className={`fixed md:static top-0 left-0 w-64 bg-white shadow-md p-6 flex flex-col space-y-4 transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo / Title */}
        <h2 className="text-2xl font-bold mb-6 hidden md:block">Doctor Portal</h2>

        {/* Navigation items */}
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActiveTab(item.key);
              setIsOpen(false); // close menu on mobile
            }}
            className={`text-left p-2 rounded-lg font-medium ${
              activeTab === item.key
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => alert("Logged out!")}
          className="text-left p-2 rounded-lg hover:bg-red-100 text-red-600 font-medium"
        >
          Logout
        </button>
      </div>

      {/* Dark overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
