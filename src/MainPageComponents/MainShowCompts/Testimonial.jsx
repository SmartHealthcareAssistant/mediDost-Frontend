import img1 from "../../assets/Images/Testimonialimg1.png";
import img2 from "../../assets/Images/Testimonialimg2.png";
import img3 from "../../assets/Images/Testimonialimg3.png";
import img4 from "../../assets/Images/Testimonialimg4.png";
export default function Testimonials() {
  const testimonials = [
    {
      name: "Priyanka Singh",
      img: img1,
      text: "General Physician: Provides primary care and treats common illnesses for overall health."
    },
    {
      name: "Sanjay Sinha",
      img: img2,
      text: "Cardiologist: Specializes in diagnosing and treating heart-related conditions."
    },
    {
      name: "Ruhani Rai",
      img: img3,
      text: "Dermatologist: Expert in skin, hair, and nail health and treatments."
    },
    {
      name: "Rakesh Gupta",
      img: img4,
      text: "Pediatrician: Focuses on medical care for infants, children, and adolescents."
    },
  ];

  return (
    <>
      <div className="m-6 sm:m-10 md:m-16 mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Testimonials</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="shadow-md rounded-2xl p-6 text-center border hover:shadow-lg transition"
            >
              <div
                className="w-16 h-16 mx-auto rounded-full mb-4 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${t.img})` }}
              ></div>

              <h3 className="text-lg font-semibold">{t.name}</h3>

              <p className="text-gray-500 text-sm mt-2">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
