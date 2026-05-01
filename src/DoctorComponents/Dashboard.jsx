import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ appointments = [] }) {
  const navigate = useNavigate();
  const doctorName = localStorage.getItem("doctorName");

  const handleLogout = () => {
    localStorage.clear(); // remove token and doctor info
    navigate("/login");
  };

  // Appointment stats
  const total = appointments.length;
  const accepted = appointments.filter((a) => a.status === "Accepted").length;
  const pending = appointments.filter((a) => a.status === "Pending").length;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-green-50 flex flex-col items-center">
      {/* Welcome & Logout */}
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center mb-6 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Dr. {doctorName}
        </h2>
        <p className="text-gray-700 mb-6">
          This is your dashboard. You can manage appointments, view patients, and more.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Appointment Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Total Appointments</h2>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Accepted</h2>
          <p className="text-3xl font-bold text-green-600">{accepted}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-3xl font-bold text-yellow-600">{pending}</p>
        </div>
      </div>
    </div>
  );
}
