import { 
  FaUser, 
  FaStethoscope, 
  FaHospital 
} from "react-icons/fa";

export default function CardsImg() {

  const cardData = [
    {
      icon: <FaUser className="text-blue-600 text-4xl mx-auto mb-3" />,
      title: "Patient",
      description: "Manage health records, book appointments, and get reminders.",
      border: "border-blue-300",
      hoverBorder: "hover:border-blue-600",
    },
    {
      icon: <FaStethoscope className="text-green-600 text-4xl mx-auto mb-3" />,
      title: "Doctor",
      description: "Handle schedules, prescriptions, and patient consultations.",
      border: "border-green-300",
      hoverBorder: "hover:border-green-600",
    },
    {
      icon: <FaHospital className="text-purple-600 text-4xl mx-auto mb-3" />,
      title: "Pharmacy",
      description: "Facilitate medicine availability, prescription fulfillment, and reliable patient support.",
      border: "border-purple-300",
      hoverBorder: "hover:border-purple-600",
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 py-20 md:px-10 lg:px-[120px] justify-items-center">
        
        {cardData.map((card, index) => (
          <div 
            key={index}
            className={`w-full max-w-[260px] h-[235px] p-6 bg-white rounded-2xl shadow-md text-center cursor-pointer
              border ${card.border} transition-all duration-300 
              hover:shadow-xl hover:-translate-y-2
              hover:border-t-4 ${card.hoverBorder}`}
          >
            {card.icon}
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-700 text-sm">{card.description}</p>
          </div>
        ))}

      </div>
    </>
  );
}
