import logo from "../../assets/logo/Sha-Logo.png";

export default function ShaLogo() {
  return (
    <div className="flex items-center select-none">

      {/* Logo Image */}
      <img
        src={logo}
        alt="MediDost Logo"
        className="
          h-10 sm:h-12 md:h-14 lg:h-16
          w-auto object-contain
        "
      />

      {/* Brand Name */}
      <h1
        className="
          text-lg sm:text-xl md:text-2xl lg:text-3xl
          font-bold
          tracking-normal
          leading-none
        "
      >
        <span className="text-blue-900">
          Medi
        </span>
        <span className="text-teal-700">
          Dost
        </span>
      </h1>

    </div>
  );
}
