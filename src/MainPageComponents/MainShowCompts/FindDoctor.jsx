import React, { useState } from "react";
import axios from "axios";
import { FaSearch, FaStar, FaStethoscope } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Example specializations
const specializations = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Gynecologist",
  "Orthopedic",
  "ENT Specialist",
  "Psychiatrist",
  "Dentist",
  "General Physician",
  "Oncologist",
  "Urologist",
  "Gastroenterologist",
  "Ophthalmologist",
  "Physiotherapist",
  "Immunologist",
];

const FindDoctor = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null); // For modal
  const [appointment, setAppointment] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    type: "",
    reason: "",
  });

  // Fetch doctors from backend
  const searchDoctors = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (location) params.location = location;
      if (specialization) params.specialization = specialization;

      const { data } = await axios.get(
        "https://medidost-smart-healthcare-app.onrender.com/api/doctor/search",
        { params }
      );

      if (data.success && data.doctors && data.doctors.length > 0) {
        setDoctors(data.doctors);
      } else {
        setError("No doctors found for the selected criteria.");
        setDoctors([]);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Server error, please try again later.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment form submission
const handleBookClick = (doc) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login", { state: { message: "Please login to book appointment" } });
    return;
  }

  // ✅ Logged in → open modal
  setSelectedDoctor(doc);
};

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700 flex items-center justify-center gap-2">
        <FaStethoscope className="text-blue-500" /> Best Doctor for you
      </h2>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-5 mb-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200 items-center">
        {/* Location Input */}
        <div className="relative flex-1 w-full">
          <MdLocationOn className="absolute left-3 top-3 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Enter location (e.g., Delhi)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Specialization Dropdown */}
        <div className="relative flex-1 w-full">
          <FaStethoscope className="absolute left-3 top-3 text-gray-400 text-xl" />
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={searchDoctors}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <FaSearch /> Search
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <p className="text-center text-gray-500 text-lg">Loading doctors...</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      )}

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-200 border border-gray-100 overflow-hidden"
          >
            {/* Doctor Image */}
            <img
src={
  doc.image?.startsWith("/uploads")
    ? `https://medidost-smart-healthcare-app.onrender.com${doc.image}`
    : doc.image || "https://via.placeholder.com/400x250?text=Doctor"
}
              alt={doc.name}
              className="w-full h-52 object-cover"
            />

            {/* Doctor Info */}
            <div className="p-5">
              <h3 className="text-xl font-semibold text-blue-700 mb-1">
                {doc.name}
              </h3>
              <p className="text-gray-600 mb-2">{doc.specialization}</p>

              {/* Rating */}
<div className="flex items-center gap-1 mb-3">
  {[1, 2, 3, 4, 5].map((star) => (
    <FaStar
      key={star}
      className={
        star <= Math.floor(doc.rating || 0)
          ? "text-yellow-400"
          : "text-gray-300"
      }
    />
  ))}

  <span className="ml-2 text-sm text-gray-700 font-medium">
    {doc.rating ? doc.rating.toFixed(1) : "0.0"}
  </span>

  <span className="text-gray-500 text-xs">
    ({doc.numReviews || 0} reviews)
  </span>
</div>

              {/* Details */}
              <div className="text-gray-700 text-sm mb-2">
                <p>
                  <span className="font-medium">Experience:</span> {doc.experience}{" "}
                  years
                </p>
                <p>
                  <span className="font-medium">Location:</span> {doc.location}
                </p>
                <p>
                  <span className="font-medium">Consultation Fee:</span> ₹
                  {doc.consultationFee}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {doc.phone}
                </p>
              </div>

              {/* Availability + Button */}
              <div className="flex justify-between items-center mt-4">
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    doc.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {doc.available ? "Available" : "Not Available"}
                </span>

                <button
                  onClick={() => handleBookClick(doc)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <IoClose size={22} />
            </button>

            <h3 className="text-xl font-semibold mb-2 text-blue-700 text-center">
              Book Appointment
            </h3>
            <p className="text-center text-gray-600 mb-4">
              with <span className="font-medium">{selectedDoctor.name}</span>
            </p>

            {/* Appointment Form */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your Name"
                value={appointment.name}
                onChange={(e) =>
                  setAppointment({ ...appointment, name: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={appointment.email || ""}
                onChange={(e) =>
                  setAppointment({ ...appointment, email: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={appointment.phone || ""}
                onChange={(e) =>
                  setAppointment({ ...appointment, phone: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="date"
                value={appointment.date}
                onChange={(e) =>
                  setAppointment({ ...appointment, date: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="time"
                value={appointment.time}
                onChange={(e) =>
                  setAppointment({ ...appointment, time: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={appointment.type || ""}
                onChange={(e) =>
                  setAppointment({ ...appointment, type: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Appointment Type</option>
                <option value="In-person">In-person</option>
                <option value="Online">Online / Video Call</option>
              </select>
              <textarea
                placeholder="Reason for Visit / Symptoms (optional)"
                value={appointment.reason || ""}
                onChange={(e) =>
                  setAppointment({ ...appointment, reason: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />

              <button
                onClick={handleBook}
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mt-2"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDoctor;
