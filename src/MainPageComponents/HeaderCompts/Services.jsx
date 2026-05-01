import React from "react";
import { FaUserMd, FaPrescriptionBottle, FaStethoscope, FaCalendarAlt, FaHandsHelping, FaHeartbeat } from "react-icons/fa";

const servicesList = [
  {
      id: 1,
      title: "Appointment Booking",
      description:
        "Schedule appointments with trusted doctors at your preferred time and location.",
      icon: <FaCalendarAlt className="text-blue-600 text-4xl" />,
  },
  {
    id: 2,
    title: "Wellness & Preventive Care",
    description: "Programs & plans to keep you healthy — diet, fitness, screenings.",
    icon: <FaHeartbeat className="text-pink-600 text-4xl" />,
    link: "/services/wellness",
  },
  {
    id: 3,
    title: "Health Check-ups",
    description: "Book basic and advanced diagnostic checkups at trusted labs.",
    icon: <FaStethoscope className="text-purple-600 text-4xl" />,
    link: "/services/checkups",
  },
  {
    id: 4,
    title: "Patient Support",
    description: "Get advice, follow-ups, reminders and health guidance from experts.",
    icon: <FaHandsHelping className="text-orange-600 text-4xl" />,
    link: "/services/support",
  },
  {
    id: 5,
    title: "Doctor Access",
    description: "Specialists across multiple fields available for in-clinic or online support.",
    icon: <FaUserMd className="text-blue-600 text-4xl" />,
    link: "/services/doctor-access",  // optional
  },
  {
    id: 6,
    title: "Pharmacy Services",
    description: "Order your medicines, verified pharmacists, fast delivery.",
    icon: <FaPrescriptionBottle className="text-green-600 text-4xl" />,
    link: "/services/pharmacy",
  },    
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header / Intro */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Services We Provide</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Reliable & trusted healthcare services tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              {service.link && (
                <a
                  href={service.link}
                  className="mt-auto inline-block text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
