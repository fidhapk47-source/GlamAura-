import React, { useEffect, useState } from "react";
import API from "../api";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  // LOAD WISHLIST
  const loadWishlist = async () => {
    try {
      const res = await API.get("/api/wishlist/");
      setWishlist(res.data);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // REMOVE ITEM
  const removeWishlist = async (id) => {
    try {
      await API.delete(`/api/wishlist/remove/${id}/`);
      loadWishlist();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // MOVE TO CART
  const moveToCart = async (item) => {
    try {
      await API.post("/api/cart/add/", {
        product_id: item.product_id,
      });

      await API.delete(`/api/wishlist/remove/${item.id}/`);

      loadWishlist();
      alert("Moved to Cart!");
    } catch (err) {
      console.error("Error moving to cart:", err);
    }
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="empty-text">No items in wishlist</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">

              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.name}
                className="wishlist-img"
              />

              <h4>{item.name}</h4>
              <b>₹{item.price}</b>

              <div className="wishlist-buttons">
                <button
                  className="move-btn"
                  onClick={() => moveToCart(item)}
                >
                  Move to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeWishlist(item.id)}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;