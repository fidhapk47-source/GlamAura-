import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ConfirmOrder.css";

function ConfirmOrder() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    setItems(data);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleConfirm = () => {
    navigate("/payment");
  };

  return (
    <div className="confirm-container">
      <h2>Confirm Your Order</h2>

      {items.length === 0 ? (
        <h3>No items found</h3>
      ) : (
        <>
          {items.map((item) => (
            <div className="confirm-card" key={item.id}>

              {/* ✅ IMAGE */}
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.name}
                className="confirm-img"
              />

              {/* ✅ DETAILS */}
              <div className="confirm-details">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p className="subtotal">
                  Subtotal: ₹{item.price * item.quantity}
                </p>
              </div>

            </div>
          ))}

          {/* ✅ TOTAL */}
          <div className="confirm-total">
            <h3>Total: ₹{total}</h3>
          </div>

          {/* ✅ BUTTON */}
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Order
          </button>
        </>
      )}
    </div>
  );
}

export default ConfirmOrder;