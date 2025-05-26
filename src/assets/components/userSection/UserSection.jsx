import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [yourCoins, setYourCoins] = useState(0);
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [yearly, setYearly] = useState(null);
  const [userId, setUserId] = useState(null)
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/api/auth/user-level", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setYourCoins(response.data.coins);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/totalRegistered", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.allUsers);
        setUserId(response.data.allUsers[0]._id)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Call the fetchUserData and fetchUsers functions
    fetchUserData();
    fetchUsers();
  }, []);
  const getDailyLoginFrequency = async (userId, date) => {
    try {
      const res = await API.get(`/api/admin/users/${userId}/login-frequency/daily`, {
        params: { date }
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching daily login frequency:', error.response?.data || error.message);
      throw error;
    }
  };
  const getMonthlyLoginFrequency = async (userId, month) => {
    try {
      const res = await API.get(`/api/admin/users/${userId}/login-frequency/monthly`, {
        params: { month }
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching monthly login frequency:', error.response?.data || error.message);
      throw error;
    }
  };
  const getYearlyLoginFrequency = async (userId, year) => {
    try {
      const res = await API.get(`/api/admin/users/${userId}/login-frequency/yearly`, {
        params: { year }
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching yearly login frequency:', error.response?.data || error.message);
      throw error;
    }
  };
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        const month = date.slice(0, 7);
        const year = date.slice(0, 4);

        const dailyData = await getDailyLoginFrequency(userId, date);
        const monthlyData = await getMonthlyLoginFrequency(userId, month);
        const yearlyData = await getYearlyLoginFrequency(userId, year);

        setDaily(dailyData.count);
        setMonthly(monthlyData.count);
        setYearly(yearlyData.count);
      } catch (err) {
        console.error('Failed to fetch activity stats:', err);
      }
    };

    fetchStats();
  }, [userId]);


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
          <p>📅 Logins Today: {daily}</p>
          <p>📈 Logins This Week: {monthly}</p>
          <p>📆 Logins This Month: {yearly}</p>
          <p>🔥 Sessions Started: {user.sessionCount || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default UserSection;
