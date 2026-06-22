import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Adminsidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ❌ remove tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("admin");

    // 🔁 redirect to admin login
    navigate("/admin/login");
  };

  return (
    <>
      <div className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/products">Products</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
        </ul>

        {/* ✅ LOGOUT BUTTON */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </>
  );
}

export default AdminSidebar;