import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole, requiredStep }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Step-based protection (for OTP, reset, etc.)
  if (requiredStep) {
    const stepFlag = window.localStorage.getItem(requiredStep);
    console.log(
      `[ProtectedRoute] requiredStep: ${requiredStep}, value:`,
      stepFlag
    );
    if (!stepFlag) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    // If requiredRole is also set, check role (for rare cases)
    if (requiredRole && (!user || user.role !== requiredRole)) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    // Allow access if step flag is present
    return children;
  }

  // Not authenticated (for normal protected routes)
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Role-based protection
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

// --- PublicRoute ---
import React from "react";

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return children;
};
