import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map((user, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-2">{user.username}</h2>
          <p>✅ Verified: {user.isVerified ? "Yes" : "No"}</p>
          <p>🏆 Level: {user.level}</p>
          <p>🪙 Coins: {user.coins}</p>
          <p>📌 Total Tasks: {user.totalTasks}</p>
          <p>⏱ Avg Focus Time: {user.avgFocusTime} min</p>
          <p>📅 Logins Today: {user.loginCountToday}</p>
          <p>📈 Logins This Week: {user.loginCountWeek}</p>
          <p>📆 Logins This Month: {user.loginCountMonth}</p>
          <p>🔥 Sessions Started: {user.sessionCount || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default UserSection;
