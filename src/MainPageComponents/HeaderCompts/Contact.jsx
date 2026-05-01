import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Contact() {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Left Side - Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600">
            Our support team is here to answer your queries and assist you with 
            booking appointments, prescriptions, or healthcare services.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-600 text-xl" />
              <p className="text-gray-700">
                <strong>Helpline:</strong> +91 98765 43210
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600 text-xl" />
              <p className="text-gray-700">
                <strong>Email:</strong> support@smarthealthcare.com
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600 text-xl" />
              <p className="text-gray-700">
                <strong>Address:</strong> 123 Healthcare Street, New Delhi, India
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-blue-600 text-xl" />
              <p className="text-gray-700">
                <strong>Working Hours:</strong> Mon–Sat, 9:00 AM – 7:00 PM
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mt-4">
            <p className="text-red-700 text-sm">
              🚑 <strong>Emergency?</strong> Call 108 or visit your nearest hospital immediately.
            </p>
          </div>
        </div>
    
        {/* Right Side - Contact Form */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Send Us a Message
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="4"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
