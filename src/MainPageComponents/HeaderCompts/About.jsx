export default function About() {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">About Us</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Smart Healthcare Assistant is a digital healthcare platform designed 
            to connect patients, doctors, and pharmacists with ease. 
            Our mission is to make quality healthcare accessible, convenient, 
            and efficient for everyone.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To simplify healthcare access by providing patients with seamless 
              appointment booking, digital consultations, and health record management.
            </p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To build a connected healthcare ecosystem where technology 
              bridges the gap between patients, doctors, and providers.
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">What We Offer</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">Easy Appointment Booking</h4>
              <p className="text-gray-600 text-sm">
                Patients can schedule appointments with doctors and healthcare providers in just a few clicks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">Doctor & Patient Dashboard</h4>
              <p className="text-gray-600 text-sm">
                Dedicated dashboards for doctors and patients to manage consultations, prescriptions, and records.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">Pharmacy Support</h4>
              <p className="text-gray-600 text-sm">
                Pharmacists can assist patients with prescriptions and medication management digitally.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Note */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-gray-700 text-lg">
            At Smart Healthcare Assistant, we believe technology can make 
            healthcare more human. Our platform is built to empower patients, 
            support doctors, and simplify healthcare for all.
          </p>
        </div>
      </div>
    </section>
  );
}
