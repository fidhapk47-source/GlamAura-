import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Adminusers.css";

function Adminusers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("access");

  const API_URL = "http://127.0.0.1:8000/api/admin/users/";

  // 🔹 LOAD USERS
  const loadUsers = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        alert("Session expired");
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔹 BLOCK USER
  const blockUser = async (id) => {
    try {
      await axios.patch(
        `${API_URL}block/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 UNBLOCK USER
  const unblockUser = async (id) => {
    try {
      await axios.patch(
        `${API_URL}unblock/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 DELETE USER
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // remove from UI instantly
      setUsers((prev) => prev.filter((u) => u.id !== id));

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-users-container">
      <h2>User Management</h2>

      <table className="user-table">
        <thead>
          <tr className="table_clr">
            <th></th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((u) => u.role !== "admin")
            .map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>

                <td
                  className={
                    user.status === "active"
                      ? "status-active"
                      : "status-blocked"
                  }
                >
                  {user.status}
                </td>

                <td style={{ display: "flex", gap: "10px" }}>
                  
                  {/* BLOCK / UNBLOCK */}
                  {user.status === "blocked" ? (
                    <button
                      className="unblock-btn"
                      onClick={() => unblockUser(user.id)}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="block-btn"
                      onClick={() => blockUser(user.id)}
                    >
                      Block
                    </button>
                  )}

                  {/* 🔥 DELETE BUTTON */}
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Adminusers;