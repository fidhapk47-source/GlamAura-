import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import "./Product.css";

function Product() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ LOAD PRODUCTS
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await API.get("/api/products/");

        const filtered = res.data.filter(
          (item) =>
            item.category.toLowerCase() === category.toLowerCase()
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    }

    fetchProducts();
  }, [category]);

  // ✅ ADD TO CART
  const addToCart = async (item) => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      await API.post("/api/cart/add/", {
        product_id: item.id,
      });

      alert("Added to Cart ✅");
      navigate("/cart");   // redirect
    } catch (err) {
      console.error("Cart error:", err);
      alert("Error adding to cart");
    }
  };

  // ✅ ADD TO WISHLIST
 async function addToWishlist(item) {
  try {
    await API.post("/api/wishlist/add/", {
      product_id: item.id,
    });

    alert("Added to Wishlist!");
  } catch (err) {
    console.error(err);
    alert("Already added or error");
  }
}

  return (
    <div className="Main-container" >
      {/* <h1 className="product-title">
        <i>{category?.toUpperCase()}</i>
      </h1> */}

      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((item) => (
            <div key={item.id} className="product-card">

              {/* ❤️ Wishlist */}
              <button
                className="wishlist-floating"
                onClick={() => addToWishlist(item)}
              >
                <Heart size={22} />
              </button>

              {/* IMAGE */}
              <Link to={`/product/${item.id}`}>
                <img
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.name}
                  className="product-img"
                />
              </Link>

              {/* DETAILS */}
              <h4 className="subtitle">{item.subtitle}</h4>
              <h3 className="product-name">{item.name}</h3>

              <div className="price-row">
                <span className="old-price">₹{item.old_price}</span>
                <span className="new-price">₹{item.new_price}</span>
              </div>

              {/* 🛒 CART */}
              <button
                className="cart-full-btn"
                onClick={() => addToCart(item)}
              >
                <ShoppingCart size={20} /> ADD TO CART
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Product;