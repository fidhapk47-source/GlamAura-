import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function PaymentMethod() {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const handlePayment = async () => {
    const orderId = localStorage.getItem("order_id");

    if (!orderId) {
      alert("Order not found");
      return;
    }

    try {
      const res = await API.post(
        "/api/orders/pay/",
        {
          order_id: orderId,
          payment_method: method,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (method === "cod") {
        alert("Order placed successfully!");
        navigate("/success");
      }

      if (method === "onlinepayment") {
        // 👉 Razorpay logic here
        alert("Proceeding to Razorpay...");
      }

    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Select Payment Method</h2>

      <label>
        <input
          type="radio"
          checked={method === "cod"}
          onChange={() => setMethod("cod")}
        />
        Cash on Delivery
      </label>

      <br />

      <label>
        <input
          type="radio"
          checked={method === "onlinepayment"}
          onChange={() => setMethod("onlinepayment")}
        />
        Online Payment
      </label>

      <br />

      <label>
        <input
          type="radio"
          checked={method === "wallet"}
          onChange={() => setMethod("wallet")}
        />
        Wallet
      </label>

      <br /><br />

      <button onClick={handlePayment}>
        Proceed to Pay
      </button>
    </div>
  );
}

export default PaymentMethod;