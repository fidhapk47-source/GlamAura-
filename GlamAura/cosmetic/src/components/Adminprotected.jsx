import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = localStorage.getItem("access");

  if (!token || !admin) {
    return <Navigate to="/admin/login" />;
  }

  if (admin?.is_superuser !== true && admin?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedAdminRoute;