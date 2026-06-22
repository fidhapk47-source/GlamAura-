import React, { useState, useEffect } from "react";
import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import "./OTP.css";

function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  // ❗ Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // ⏱ TIMER
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ VERIFY OTP
  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert("Enter valid OTP");
      return;
    }

    setLoading(true);

    try {
      await API.post("/verify-otp/", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      alert("Account Verified ✅");
      navigate("/login");

    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Invalid OTP ❌"
      );
    }

    setLoading(false);
  };

  // 🔁 RESEND OTP
  const handleResend = async () => {
    try {
      await API.post("/resend-otp/", {
        email: email.trim().toLowerCase(),
      });

      alert("OTP sent again 📧");
      setTimer(60);

    } catch {
      alert("Error sending OTP");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">

        <h2>Verify Your Email</h2>
        <p>Enter OTP sent to {email}</p>

        <input
  type="text"
  maxLength="6"
  value={otp}
  onChange={(e) => setOtp(e.target.value.trim())}
  className="otp-input"
  placeholder="Enter OTP"
/>

        <button onClick={handleVerify} className="verify-btn">
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="resend-section">
          {timer > 0 ? (
            <p>Resend in {timer}s</p>
          ) : (
            <button onClick={handleResend} className="resend-btn">
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default OTPVerification;