import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelopeOpenText,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PharmacyPendingVerificationPage = () => {
  const [message, setMessage] = useState(
    "Your pharmacy profile is under review by the Admin. This process usually takes 24-48 hours. Please do not re-submit your documents."
  );
  const [status, setStatus] = useState("Pending");

  const navigate = useNavigate();
  const API_URL = "https://smart-healthcare-app-ghwj.onrender.com";

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  };

  useEffect(() => {
    const pharmacyId = localStorage.getItem("pharmacyId");

    if (!pharmacyId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const socket = io(API_URL);

    // 🔥 JOIN ROOM
    socket.emit("registerPharmacy", pharmacyId);

    // 🔥 LISTEN EVENT
    socket.on("pharmacyVerificationUpdate", (data) => {
      console.log("Pharmacy verification update:", data);

      setMessage(data.message);
      setStatus(data.status);

      if (data.status === "Approved") {
        toast.success(data.message);

        localStorage.clear();

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } 
      else if (data.status === "Rejected") {
        toast.error(data.message);
      }
    });

    return () => {
      socket.off("pharmacyVerificationUpdate");
      socket.disconnect();
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 mt-10 mb-10">

      {/* ✅ Toast */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div
        className={`p-8 rounded-xl shadow-lg text-center max-w-md w-full 
        ${
          status === "Approved"
            ? "bg-green-100 border-green-400"
            : status === "Rejected"
            ? "bg-red-100 border-red-400"
            : "bg-yellow-100 border-yellow-400"
        } border-2`}
      >

        {/* ICON */}
        <div className="flex justify-center mb-4">
          {status === "Pending" && (
            <FaClock className="text-yellow-600 text-5xl" />
          )}
          {status === "Approved" && (
            <FaCheckCircle className="text-green-600 text-5xl" />
          )}
          {status === "Rejected" && (
            <FaTimesCircle className="text-red-600 text-5xl" />
          )}
        </div>

        {/* TITLE */}
        <h2
          className={`text-2xl font-bold mb-4 
          ${
            status === "Approved"
              ? "text-green-700"
              : status === "Rejected"
              ? "text-red-700"
              : "text-yellow-700"
          }`}
        >
          {status === "Pending"
            ? "⌛ Pharmacy Verification Pending"
            : status === "Approved"
            ? "✅ Pharmacy Verified Successfully!"
            : "❌ Verification Rejected"}
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-700 mb-6">{message}</p>

        {/* EMAIL INFO */}
        {status === "Pending" && (
          <div className="flex flex-col items-center mb-3">
            <FaEnvelopeOpenText className="text-blue-600 text-4xl mb-2" />
            <p className="text-gray-600 text-sm">
              We will notify you through{" "}
              <span className="font-semibold">Email</span> once your verification
              is completed.
            </p>
          </div>
        )}

        {/* LOADING MESSAGE */}
        {status === "Pending" && (
          <div className="animate-pulse text-indigo-500 font-medium">
            Thank you for your patience!
          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PharmacyPendingVerificationPage;