import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar({ resetApp }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Do you want to clear all data and reset the app?')) {
      localStorage.removeItem('pharmacistProfile');
      localStorage.removeItem('products');
      resetApp(); // Reset state in Dashboard
      navigate('/'); // Go to main page (login or homepage)
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 h-screen flex flex-col justify-between p-6">
      {/* Top Links */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Medical Portal</h2>
        <nav className="flex flex-col space-y-3">
          {/* Use correct nested routes */}
          <Link to="/pharmacy" className="hover:bg-gray-700 rounded p-2">
            Dashboard
          </Link>
          <Link to="/pharmacy/profile" className="hover:bg-gray-700 rounded p-2">
            Profile
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 rounded p-2 w-full"
      >
        Logout
      </button>
    </div>
  );
}
