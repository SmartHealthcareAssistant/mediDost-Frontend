import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ component: Component, allowedRole }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const profileCompleted = localStorage.getItem(`${role}ProfileCompleted`);
  const verified = localStorage.getItem(`${role}Verified`);

const isProfileComplete = profileCompleted === "true" || profileCompleted === true;
const isVerified = verified === "true" || verified === true;

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 ONLY doctor & pharmacy
  if (role === "doctor" || role === "pharmacy") {
    const base = `/${role}`;
    const complete = `${base}/complete-profile`;
    const pending = `${base}/pending-verification`;

    // 🚨 CASE 1: Profile not completed
    if (!isProfileComplete && currentPath !== complete) {
      return <Navigate to={complete} replace />;
    }

    // 🚨 CASE 2: Completed but not verified
    if (isProfileComplete && !isVerified && currentPath !== pending) {
      return <Navigate to={pending} replace />;
    }

    // 🚨 CASE 3: Verified but user is on wrong page
    if (isVerified && (currentPath === complete || currentPath === pending)) {
      return <Navigate to={base} replace />;
    }
  }

  return <Component />;
}