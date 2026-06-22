import React from "react";
import { useNavigate } from "react-router-dom";
import "./Success.css";

function Success() {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-card">

        <div className="checkmark">
          ✔
        </div>

        <h1>Order Placed Successfully!</h1>

        <p>Your order is confirmed</p>

        <div className="btn-group">
          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Success;