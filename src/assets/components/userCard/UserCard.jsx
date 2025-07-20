import "./UserCard.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLink } from "react-icons/fa";

const UserCard = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [coins, setCoins] = useState(user.coins);
    const [level, setLevel] = useState(user.level);
    const [daily, setDaily] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [yearly, setYearly] = useState(null);
    const [userId, setUserId] = useState(user._id);

    const handleSave = async () => {
      try {
        await axios.put(`/api/admin/users/${userId}`, {
          coins: Number(coins),
          level: Number(level)
        });
        toast.success("User updated successfully!");
        setIsEditing(false);
      } catch (err) {
        toast.error("Failed to update user");
      }
    };

    const getDailyLoginFrequency = async (userId, date) => {
        try {
          const res = await axios.get(`/api/admin/users/${user._id}/login-frequency/daily`, {
            params: { date }
          });
          console.log(res.data); 
          return res.data;
        } catch (error) {
          console.error('Error fetching daily login frequency:', error.response?.data || error.message);
          throw error;
        }
      };

      const getMonthlyLoginFrequency = async (userId, month) => {
        try {
          const res = await axios.get(`/api/admin/users/${user._id}/login-frequency/monthly`, {
            params: { month }
          });
          console.log(res.data); 
          return res.data;
        } catch (error) {
          console.error('Error fetching monthly login frequency:', error.response?.data || error.message);
          throw error;
        }
      };

      const getYearlyLoginFrequency = async (userId, year) => {
        try {
          const res = await axios.get(`/api/admin/users/${user._id}/login-frequency/yearly`, {
            params: { year }
          });
          console.log(res.data); 
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

            const dailyData = await getDailyLoginFrequency(user._id, date);
            const monthlyData = await getMonthlyLoginFrequency(user._id, month);
            const yearlyData = await getYearlyLoginFrequency(user._id, year);

            setDaily(dailyData.count);
            setMonthly(monthlyData.count);
            setYearly(yearlyData.count);
          } catch (err) {
            console.error('Failed to fetch activity stats:', err);
          }
        };

        fetchStats();
      }, [user._id]);    

    const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${user._id}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success('Referral link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy referral link');
      });
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>

      <div className="referral-section mb-4">
        <button 
          onClick={copyReferralLink}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <FaLink /> Invite Friends
        </button>
        <p className="text-xs text-gray-500 mt-1">Earn rewards for each friend who signs up!</p>
      </div>

      {isEditing ? (
          <>
            <label htmlFor="">Coins</label>
            <input
              type="number"
              className="border p-2 rounded w-full mb-2"
              value={coins}
              onChange={(e) => setCoins(e.target.value)}
            />
            <label htmlFor="">Level</label>
            <input
              type="number"
              className="border p-2 rounded w-full mb-2"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
            <button className="bg-green-500 mx-1 px-2 py-[0.5] rounded-[10%]" onClick={handleSave}>Save</button>
            <button className="bg-red-700 mx-1 px-2 py-[0.5] rounded-[10%]" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>

          <div className="bg-white p-4 rounded-xl shadow border">
            <h2 className="text-lg font-semibold mb-2">{user.username}</h2>
            <p>✅ Verified: {user.isVerified ? "Yes" : "No"}</p>
            <p>🏆 Level: {level}</p>
            <p>🪙 Coins: {user.coins}</p>
            <p>📅 Logins Today: {daily ? daily : "0"}</p>
            <p>📈 Logins This Month: {monthly ? monthly : "0"}</p>
            <p>📆 Logins This Year: {yearly ? yearly : "0"}</p>
            <button className="bg-[#7500CA] px-2 py-[0.5] text-white rounded-[10%]" onClick={() => setIsEditing(true)}>Edit</button>
          </div>
          </>
        )}
      </div>
    );
  };
  export default UserCard;