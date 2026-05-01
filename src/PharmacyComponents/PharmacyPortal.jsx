import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import ProfilePage from "./ProfilePage";
import { useState } from "react";

export default function PharmacyPortal() {
  const [resetKey, setResetKey] = useState(0);

  const resetApp = () => setResetKey(prev => prev + 1);

  return (
    <div className="flex min-h-screen">
      <Sidebar resetApp={resetApp} />
      <div className="flex-1 p-4">
        <Routes>
          <Route index element={<Dashboard key={resetKey} />} />       {/* /pharmacy */}
          <Route path="profile" element={<ProfilePage key={resetKey} />} /> {/* /pharmacy/profile */}
        </Routes>
      </div>
    </div>
  );
}
