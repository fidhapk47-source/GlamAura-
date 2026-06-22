import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Search } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import API from "../api";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ LOAD COUNTS
  const loadCounts = async () => {
    if (!user) return;

    try {
      const cartRes = await API.get("/api/cart/");
      const wishlistRes = await API.get("/api/wishlist/");

      const totalQty =
        cartRes.data?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

      setCartCount(totalQty);
      setWishlistCount(wishlistRes.data?.length || 0);
    } catch (err) {
      console.error("Error loading counts:", err);
    }
  };

  // ✅ CART/WISHLIST LIVE UPDATE LISTENER
  useEffect(() => {
    loadCounts();

    window.addEventListener("cartUpdated", loadCounts);

    return () => {
      window.removeEventListener("cartUpdated", loadCounts);
    };
  }, []);

  // ✅ LOAD PRODUCTS FOR SEARCH
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await API.get("/api/products/");
        setAllProducts(res.data || []);
      } catch (err) {
        console.log("Product load error:", err);
      }
    }

    fetchProducts();
  }, []);

  // ✅ SEARCH FUNCTION
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const filtered = allProducts.filter((item) => {
      return (
        item.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.category?.toLowerCase().includes(value.toLowerCase())
      );
    });

    setResults(filtered);
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.reload();
  };

  return (
    <div>
      <div className="nav-container">

        {/* LOGO */}
        <div className="logo">
          <Link className="hidd" to="/">
            <h1>GlamAura</h1>
          </Link>
        </div>

        {/* MENU */}
        <ul className="nav-menu">
          <li><Link className="hidd" to="/category/face">FACE</Link></li>
          <li><Link className="hidd" to="/category/eye">EYE</Link></li>
          <li><Link className="hidd" to="/category/lips">LIPS</Link></li>
          <li><Link className="hidd" to="/category/nail">NAIL</Link></li>
          <li><Link className="hidd" to="/category/brushes-tools">BRUSHES & TOOLS</Link></li>
          {/* <li><Link className="hidd" to="/catesgory/new-arrivals">NEW ARRIVALS</Link></li> */}
          <li><Link className="hidd" to="/category/bridal-bundle">BRIDAL BUNDLE</Link></li>
          <li><Link className="hidd" to="/category/skincare">SKIN CARE</Link></li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {/* SEARCH */}
          <div className="search-box">
            <Search size={18} className="search-icon" />

            <input
              type="text"
              placeholder="Search for products..."
              value={searchText}
              onChange={handleSearch}
            />

            {results.length > 0 && (
              <div className="search-results">
                {results.slice(0, 8).map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}   // ✅ FIXED ROUTE
                    className="search-result-item"
                    onClick={() => {
                      setSearchText("");
                      setResults([]);
                    }}
                  >
                    <img
                      src={
                        item.image
                          ? `http://127.0.0.1:8000${item.image}`
                          : ""
                      }
                      alt={item.name}
                    />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CART */}
          <Link to="/cart" className="cart-box">
            <FaShoppingCart size={24} style={{ color: "white" }} />
            <span className="count-badge">{cartCount}</span>
          </Link>

          {/* WISHLIST */}
          <Link to="/wishlist" className="wishlist-box">
            <FaHeart size={24} style={{ color: "white" }} />
            <span className="count-badge">{wishlistCount}</span>
          </Link>

          {/* LOGIN / LOGOUT */}
          {user ? (
            <button className="btn-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link className="hidd" to="/login">
              <button className="btn">Login</button>
            </Link>
          )}

        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default Navbar;