import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    income: 0,
  });

  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/admin-dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("DASHBOARD:", res.data);

        setStats({
          users: res.data.users || 0,
          products: res.data.products || 0,
          orders: res.data.orders || 0,
          income: res.data.income || 0,
        });

        setOrders(res.data.recentOrders || []);

      } catch (err) {
        console.error("Dashboard error:", err);

        if (err.response?.status === 401) {
          alert("Session expired");
          localStorage.clear();
          window.location.href = "/admin/login"; // ✅ FIXED
        }
      }
    };

    if (token) fetchDashboard();

  }, [token]);

  const chartData = [
    { name: "Sales", income: 300000, profit: 150000 },
    { name: "Face", income: 120000, profit: 45000 },
    { name: "Lips", income: 90000, profit: 30000 },
    { name: "Eye", income: 110000, profit: 40000 },
  ];

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      {/* Stats */}
      <div className="stats-cards">
        <div className="card"><h3>Users</h3><p>{stats.users}</p></div>
        <div className="card"><h3>Products</h3><p>{stats.products}</p></div>
        <div className="card"><h3>Orders</h3><p>{stats.orders}</p></div>
        <div className="card"><h3>Income</h3><p>₹{stats.income}</p></div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <h2>Sales Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#ff66cc" />
            <Bar dataKey="profit" fill="#ff1493" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders */}
      {/* <div className="recent-orders">
        <h2>Recent Orders</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.userId}</td>
                <td>{o.items.join(", ")}</td>
                <td>₹{o.total}</td>
                <td>{o.status}</td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

export default AdminDashboard;