import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";

function ServicesSec() {
  return (
    <>
      <div className="mt-[10px] px-4 sm:px-10 md:px-20 lg:mx-60 z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <div className="shadow-md rounded-2xl p-6 flex items-start gap-4 border hover:shadow-lg transition">
            <FaCalendarAlt className="text-blue-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Appointment Scheduling</h3>
              <p className="text-gray-500 text-sm">
                These fie cid brcthendid graius ationeme visus.
              </p>
            </div>
          </div>

          <div className="shadow-md rounded-2xl p-6 flex items-start gap-4 border hover:shadow-lg transition">
            <FaClipboardList className="text-yellow-500 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Personalized Care Plans</h3>
              <p className="text-gray-500 text-sm">
                These tie srve ododtatips in yous ditentce vitus.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ServicesSec;
