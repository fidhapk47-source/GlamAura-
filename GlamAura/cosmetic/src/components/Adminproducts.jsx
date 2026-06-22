import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Adminproducts.css";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("access");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");

  // ✅ LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ CLEAR FORM
  const clearForm = () => {
    setName("");
    setCategory("");
    setImage(null);
    setNewPrice("");
    setOldPrice("");
    setEditId(null); // ✅ IMPORTANT
  };

  // ✅ ADD / UPDATE
  const saveProduct = async () => {
    if (!name || !category || !newPrice || !oldPrice) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("new_price", newPrice);
    formData.append("old_price", oldPrice);

    if (image) {
      formData.append("image", image);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // ✅ FIXED CONDITION
      if (editId !== null) {
        // UPDATE
        await axios.put(
          `http://127.0.0.1:8000/api/products/${editId}/`,
          formData,
          config
        );
      } else {
        // CREATE
        await axios.post(
          "http://127.0.0.1:8000/api/products/",
          formData,
          config
        );
      }

      loadProducts();
      clearForm();
      setShowForm(false);

    } catch (err) {
      console.log("SAVE ERROR:", err.response || err);
      alert(err.response?.data?.detail || "Save failed");
    }
  };

  // ✅ EDIT
  const editProduct = (p) => {
    setEditId(p.id);
    setName(p.name);
    setCategory(p.category);
    setNewPrice(p.new_price);
    setOldPrice(p.old_price);
    setShowForm(true);
  };

  // ✅ DELETE
  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/products/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadProducts();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <div className="manage-container">
      <h2>Manage Products</h2>

      {/* ✅ FIXED ADD BUTTON */}
      <button
        className="add-btn"
        onClick={() => {
          clearForm();        // ✅ RESET editId
          setShowForm(true);
        }}
      >
        Add Product
      </button>

      {/* FORM */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3>{editId !== null ? "Edit Product" : "Add Product"}</h3>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <input
              type="number"
              placeholder="New Price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Old Price"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
            />

            <div className="form-buttons">
              <button className="save-btn" onClick={saveProduct}>
                {editId !== null ? "Update" : "Save"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  clearForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TABLE */}
      <table className="product-table">
        <thead>
          <tr className="table_clr">
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>New Price</th>
            <th>Old Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No products available
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={`http://127.0.0.1:8000${p.image}`}
                    alt=""
                    className="prod-img"
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.new_price}</td>
                <td>₹{p.old_price}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editProduct(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default ManageProducts;