import React, { useEffect, useState } from "react";
import API from "../api";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  // ✅ LOAD CART
  const loadCart = async () => {
    try {
      const res = await API.get("/api/cart/");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ✅ SELECT SINGLE
  const toggleSelect = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);

      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // ✅ SELECT ALL
  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      // unselect all
      setSelectedItems([]);
    } else {
      // select all
      setSelectedItems(cart);
    }
  };

  // ✅ CHECK IF ALL SELECTED
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  // ✅ INCREASE
  const increaseQty = async (id) => {
    await API.post(`/api/cart/increase/${id}/`);
    loadCart();
  };

  // ✅ DECREASE
  const decreaseQty = async (id) => {
    await API.post(`/api/cart/decrease/${id}/`);
    loadCart();
  };

  // ✅ REMOVE
  const removeItem = async (id) => {
    await API.delete(`/api/cart/remove/${id}/`);
    loadCart();
  };

  // ✅ TOTAL
  const total = selectedItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // ✅ BUY NOW
  const handleBuyNow = () => {
    if (selectedItems.length === 0) {
      alert("Please select items");
      return;
    }

    const formattedItems = selectedItems.map((item) => ({
      id: item.id,
      product_id: item.product_id || item.product?.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    localStorage.setItem("purchase-type", "bulk");
    localStorage.setItem("purchase-items", JSON.stringify(formattedItems));

    navigate("/payment");
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <h3>Your cart is empty</h3>
      ) : (
        <>
          {/* ✅ SELECT ALL */}
          <div className="select-all">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
            <label>Select All</label>
          </div>

          {cart.map((item) => {
            const isChecked = selectedItems.some(
              (i) => i.id === item.id
            );

            return (
              <div className="cart-card" key={item.id}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelect(item)}
                />

                <img
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.name}
                  className="cart-img"
                />

                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p><b>₹{item.price}</b></p>
                </div>

                <div className="qty-box">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>

                <button onClick={() => removeItem(item.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            );
          })}
        </>
      )}

      {/* ✅ TOTAL */}
      {selectedItems.length > 0 && (
        <div className="cart-total">
          <b>Total: ₹{total}</b>
        </div>
      )}

      {/* ✅ BUY */}
      {cart.length > 0 && (
        <button className="buy-btn" onClick={handleBuyNow}>
          Buy Now
        </button>
      )}
    </div>
  );
}

export default Cart;