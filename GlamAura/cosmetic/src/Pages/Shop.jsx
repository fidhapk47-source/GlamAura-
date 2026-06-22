import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import "./Shop.css";

function Shop() {
  const [categories, setCategories] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const res = await API.get("/api/products/");
      const products = res.data;

      // ❌ REMOVE unwanted categories
      const filtered = products.filter(
        (p) =>
          p.category?.toLowerCase() !== "new-arrivals" &&
          p.category?.toLowerCase() !== "best-seller"
      );

      // ✅ GROUP BY CATEGORY
      const grouped = {};
      filtered.forEach((item) => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });

      setGroupedItems(grouped);
      setCategories(Object.keys(grouped));

    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  // ✅ AUTO SLIDE (every 2 sec)
  useEffect(() => {
    if (categories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) =>
        prev === categories.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [categories]);

  const currentCategory = categories[currentCategoryIndex];
  const items = groupedItems[currentCategory] || [];

  return (
    <div className="shop-container">

      {/* HERO */}
      <div className="hero-area">
        <video
          className="hero-video"
          src="http://127.0.0.1:8000/media/products/videoplayback.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Glow Like Never Before</h1>
            <p className="hero-subtitle">
              Discover premium beauty & skincare products
            </p>

            <Link to="/category/face">
              <button className="hero-btn">Shop Now</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ AUTO CATEGORY SLIDER */}
      <div className="new_arrivals_bg">
        <h2 className="section-title">
          {currentCategory?.toUpperCase()}
        </h2>

        <div className="product-grid">
          {items.slice(0, 3).map((item) => (
            <div className="product-card" key={item.id}>
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.name}
              />

              <h4>{item.name}</h4>
              <p>₹{item.new_price}</p>

              <Link to={`/product/${item.id}`} className="btn-view">
                <button
                  style={{
                    backgroundColor: "#fa8bce",
                    color: "black",
                  }}
                >
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div
        style={{
          padding: "43px",
        }}
        className="category-bg"
      >
        <h2 className="section-title" style={{ color: "black" , fontFamily:"arial" }}>
          Shop by Category
        </h2>

        <div className="category-grid">
          {categories.map((cat, index) => (
            <Link
              to={`/category/${cat}`}
              key={index}
              className="category-card"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <div className="about-section">
        <h2>About GlamAuraa</h2>
        <p>
          GlamAuraa brings you premium beauty and cosmetic products from the
          world’s trusted brands. We deliver high-quality makeup and skincare
          at affordable prices.
        </p>
      </div>

      {/* FOOTER */}
      <footer className="footer" style={{ backgroundColor: "black" , color:"white"}}>
        <p>© 2025 GlamAuraa. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Shop;