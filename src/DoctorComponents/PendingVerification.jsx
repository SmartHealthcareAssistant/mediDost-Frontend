import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';

import { 
  FaEnvelopeOpenText, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle 
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingVerification = () => {
    const [message, setMessage] = useState(
        "Your profile is under review by the Admin. This process typically takes 24-48 hours. Please do not re-submit your documents."
    );
    const [status, setStatus] = useState('Pending');

    const navigate = useNavigate();
    const API_URL = "https://medidost-smart-healthcare-app.onrender.com";

    // ✅ Logout with toast
    const handleLogout = () => {
        localStorage.clear();
        toast.success("Logged out successfully!");

        setTimeout(() => {
            navigate('/login', { replace: true });
        }, 1500);
    };

    useEffect(() => {
        const doctorId = localStorage.getItem('doctorId'); 

        if (!doctorId) {
            toast.error("Session expired. Please login again.");
            navigate('/login');
            return;
        }

        const socket = io(API_URL);
        socket.emit("registerDoctor", doctorId);

        socket.on("verificationStatusUpdate", (data) => {
            console.log("Received verification update:", data);

            setMessage(data.message);
            setStatus(data.status);

            if (data.status === 'Approved') {
                toast.success(data.message);

                localStorage.clear();

                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000);
            } 
            else if (data.status === 'Rejected') {
                toast.error(data.message);
            }
        });

        return () => {
            socket.off("verificationStatusUpdate");
            socket.disconnect();
        };
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 mt-10 mb-10">
            
            {/* ✅ Toast only for this page */}
            <ToastContainer position="top-right" autoClose={3000} />

            <div className={`p-8 rounded-xl shadow-lg text-center max-w-md w-full 
                ${status === 'Approved' ? 'bg-green-100 border-green-400' 
                : status === 'Rejected' ? 'bg-red-100 border-red-400' 
                : 'bg-yellow-100 border-yellow-400'} border-2`}>

                {/* Status Icon */}
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

                <h2 className={`text-2xl font-bold mb-4 
                    ${status === 'Approved' ? 'text-green-700' 
                    : status === 'Rejected' ? 'text-red-700' 
                    : 'text-yellow-700'}`}>

                    {status === 'Pending' 
                        ? "⌛ Verification Pending" 
                        : status === 'Approved' 
                        ? "✅ Verification Successful!" 
                        : "❌ Verification Rejected"}
                </h2>

                <p className="text-gray-700 mb-6">{message}</p>

                {/* Email Info */}
                {status === 'Pending' && (
                    <div className="flex flex-col items-center mb-3">
                        <FaEnvelopeOpenText className="text-blue-600 text-4xl mb-2" />
                        <p className="text-gray-600 text-sm">
                            We will notify you through <span className="font-semibold">Email </span>
                            once your verification is completed.
                        </p>
                    </div>
                )}

                {status === 'Pending' && (
                    <div className="animate-pulse text-indigo-500 font-medium">
                        Thank you for your patience!
                    </div>
                )}

                {/* 🔥 Logout Button */}
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

export default PendingVerification;