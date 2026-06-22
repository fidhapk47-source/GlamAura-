import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();

  const [buyItems, setBuyItems] = useState([]);
  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pincode: "",
    phone: "",
  });

  const token = localStorage.getItem("access");

  // ✅ LOAD ITEMS
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("purchase-items")) || [];
    setBuyItems(items);
  }, []);

  // ✅ TOTAL
  const total = buyItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // ✅ CONFIRM ORDER
  const handleConfirm = async () => {
    if (buyItems.length === 0) {
      alert("No items selected");
      return;
    }

    if (!formData.name || !formData.address || !formData.phone) {
      alert("Please fill all details");
      return;
    }

    const items = buyItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    try {
      await API.post(
        "/api/orders/order/place-order/",
        {
          items: items,
          payment_method: method,
          name: formData.name,
          address: formData.address,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed!");
      navigate("/success");

    } catch (err) {
      console.log(err.response?.data);
      alert("Order failed");
    }
  };

  return (
    <div className="payment-container">

      <div className="payment-card">
        <h2>Payment</h2>

        {/* ✅ ITEMS */}
        {buyItems.length === 0 ? (
          <p className="empty-text">No items selected</p>
        ) : (
          buyItems.map((item, i) => (
            <div className="payment-item" key={i}>
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.name}
              />

              <div className="item-details">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            </div>
          ))
        )}

        {/* ✅ TOTAL */}
        <h3 className="payment-total">Total: ₹{total}</h3>

        {/* ✅ FORM */}
        <div className="payment-form">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Address"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Pincode"
            onChange={(e) =>
              setFormData({ ...formData, pincode: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        {/* ✅ PAYMENT METHOD */}
        <div className="payment-method">
          <label>
            <input
              type="radio"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              checked={method === "onlinepayment"}
              onChange={() => setMethod("onlinepayment")}
            />
            Online Payment
          </label>

          <label>
            <input
              type="radio"
              checked={method === "wallet"}
              onChange={() => setMethod("wallet")}
            />
            Wallet
          </label>
        </div>

        {/* ✅ BUTTON */}
        <button className="pay-btn" onClick={handleConfirm}>
          Confirm Order
        </button>

      </div>
    </div>
  );
}

export default Payment;