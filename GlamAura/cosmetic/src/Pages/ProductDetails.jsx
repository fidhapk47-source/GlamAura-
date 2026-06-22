import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./Details.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // ✅ LOAD PRODUCT
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await API.get(`/api/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error loading product:", err);
      }
    }
    loadProduct();
  }, [id]);

  // ✅ ADD TO CART
  const addToCart = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      await API.post(
        "/api/cart/add/",
        {
          product_id: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart!");
      navigate("/cart"); // ✅ redirect
    } catch (err) {
      console.error("Cart error:", err.response?.data || err.message);
      alert("Error adding to cart");
    }
  };

  // ✅ LOADING STATE
  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="detailss-container">
        
        {/* IMAGE */}
        <div className="details-container">
          <img
            src={`http://127.0.0.1:8000${product.image}`}
            alt={product.name}
            className="details-img"
          />
        </div>

        {/* CONTENT */}
        <div className="details-content">
          <h1>{product.name}</h1>

          <p className="price">
            <b>₹{product.new_price}</b>
            <span className="old-price">₹{product.old_price}</span>
          </p>

          <p>
            <b>Category:</b> {product.category}
          </p>

          <p>
            <b>Description:</b>{" "}
            {product.description || "No description available"}
          </p>

          {/* BUTTON */}
          <button className="add-cart" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 GlamAuraa. All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default ProductDetails;