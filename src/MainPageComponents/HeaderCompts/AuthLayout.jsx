import ShaLogo from "./ShaLogo";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Branding */}
      <div className="mb-6 text-center">
        <ShaLogo />
        <h1 className="text-2xl font-bold text-gray-700">Smart Healthcare Assistant</h1>
      </div>

      {/* Login/Register render here */}
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <Outlet />
      </div>

      {/* Back to home */}
      <p className="mt-4 text-sm text-gray-500">
        <Link to="/" className="text-sky-500 hover:underline">← Back to Home</Link>
      </p>
    </div>
  );
}
