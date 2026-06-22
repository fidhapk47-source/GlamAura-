import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./adminlog.css";

function Adminlogin() {
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handlelogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/admin-login/", {
        email,
        password,
      });

      console.log("FULL RESPONSE:", res.data);

      const access = res.data.access;
      const refresh = res.data.refresh;
      const user = res.data.user;

      // ❌ if backend fails
      if (!access) {
        alert("Login failed");
        return;
      }

      // save
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("admin", JSON.stringify(user));

      console.log("ADMIN USER:", user);

      // redirect
      if (user?.is_superuser) {
        navigate("/admin/dashboard");
      } else {
        navigate("/login");
      }

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-box" onSubmit={handlelogin}>
        <h1>Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Adminlogin;