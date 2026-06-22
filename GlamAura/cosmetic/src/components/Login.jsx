import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // 🔹 SIGNUP (SEND OTP)
  const handleSignup = async () => {
    if (!email || !password) {
      setMsg("Please fill all fields");
      return;
    }

    try {
      await API.post("/register/", {
        username: email.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      // ✅ Go to OTP page
      navigate("/verify-otp", {
        state: { email: email.trim().toLowerCase() },
      });

    } catch (err) {
      setMsg(
        err.response?.data?.error ||
        err.response?.data?.email?.[0] ||
        "Signup failed"
      );
    }
  };

  // 🔹 LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      setMsg("Enter email & password");
      return;
    }

    try {
      const res = await API.post("/login/", {
        username: email.trim().toLowerCase(),
        password: password,
      });

      const { access, refresh, user } = res.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setMsg("Login successful");

      setTimeout(() => {
        window.location.href = "/";
      }, 500);

    } catch (err) {

      // ✅ IF NOT VERIFIED → GO TO OTP PAGE
      if (
        err.response?.status === 403 &&
        err.response?.data?.email
      ) {
        navigate("/verify-otp", {
          state: { email: err.response.data.email },
        });
      } else {
        setMsg(
          err.response?.data?.detail ||
          "Login failed"
        );
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2 className="login-title">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {msg && <p className="login-message">{msg}</p>}

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-btn"
          onClick={isLogin ? handleLogin : handleSignup}
        >
          {isLogin ? "Login" : "Send OTP"}
        </button>

        <p
          className="switch-text"
          onClick={() => {
            setMsg("");
            setIsLogin(!isLogin);
          }}
        >
          {isLogin
            ? "Create new account"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}

export default Login;