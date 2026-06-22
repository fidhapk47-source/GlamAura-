import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Adminorders.css";

function Adminorders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState(""); // ✅ NEW

  const token = localStorage.getItem("access");
  const API_URL = "http://127.0.0.1:8000/api/admin/orders/";

  // ✅ LOAD ORDERS WITH SEARCH
  const loadOrders = async () => {
    try {
      const res = await axios.get(
        `${API_URL}?search=${search}`, // 🔥 ADD SEARCH PARAM
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ORDERS:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  // ✅ RELOAD WHEN SEARCH CHANGES
  useEffect(() => {
    loadOrders();
  }, [search]); // 🔥 IMPORTANT

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API_URL}${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  // ✅ DELETE ORDER (FIXED URL)
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${API_URL}delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <div className="admin-orders-container">
      <h1 className="title">Order Management</h1>

      {/* 🔍 SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search by Order ID or Username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th className="table_clr">Order</th>
              <th className="table_clr">User</th>
              <th className="table_clr">Items</th>
              <th className="table_clr">Total</th>
              <th className="table_clr">Date</th>
              <th className="table_clr">Payment</th>
              <th className="table_clr">Status</th>
              <th className="table_clr">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td># {order.id}</td>
                <td>{order.username}</td>

                <td>
                  {order.items?.map((item, i) => (
                    <div key={i} className="admin-item">
                      <img
                        src={`http://127.0.0.1:8000${item.product_image}`}
                        alt={item.product_name}
                        className="admin-item-img"
                      />
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </td>

                <td>₹{order.total_amount}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{order.payment_method}</td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="status-dropdown"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="no-orders-msg">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Adminorders;