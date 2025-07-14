import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, TrendingUp, Coins, ShoppingCart, ListChecks } from "lucide-react";
import { motion } from "framer-motion"; // Import motion
import "./UserStatsDisplay.css";

// Animation variants
const barVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const UserStatsDisplay = () => {
  const [stats, setStats] = useState({
    totalTime: "0h 0m",
    totalCoinsEarned: 0,
    currentCoins: 0,
    coinsSpent: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchTotalFocusTime = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "0h 0m";
      const response = await axios.get("/api/user-activity/total-time-spent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.totalTimeSpent !== undefined) {
        const totalSeconds = response.data.totalTimeSpent;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
      }
      return "0h 0m";
    } catch (error) {
      console.error("Error fetching total focus time for StatsDisplay:", error.message);
      return "0h 0m";
    }
  };

  const fetchUserCoreStats = async () => { // Now primarily for currentCoins
    try {
      const token = localStorage.getItem("token");
      if (!token) return { currentCoins: 0 }; 
      const response = await axios.get("/api/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        return {
          currentCoins: response.data.currentCoins || 0,
          // completedTasks logic is now handled by fetchCompletedTasksCount
        };
      }
      return { currentCoins: 0 };
    } catch (error) {
      console.error(
        "Error fetching user core stats (coins) for StatsDisplay:", // Clarified error message
        error.response?.data || error.message
      );
      return { currentCoins: 0 };
    }
  };

  const fetchTotalCoinsEarned = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return 0;
      const response = await axios.get("/api/user-activity/total-coins-earned", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.totalCoinsEarned || 0;
    } catch (error) {
      console.error("Error fetching total coins earned for StatsDisplay:", error.message);
      return 0;
    }
  };

  const fetchCoinsSpent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return 0;
      const response = await axios.get("/api/user-activity/coins-spent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.coinsSpent || 0;
    } catch (error) {
      console.error("Error fetching coins spent for StatsDisplay:", error.message);
      return 0;
    }
  };

  const fetchCompletedTasksCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return 0;
      const response = await axios.get("/api/tasks/completed", { // Endpoint for completed tasks count
        headers: { Authorization: `Bearer ${token}` },
      });
      // Backend sends { count: Number, completedTasks: Array }
      // We need the 'count' field.
      return response.data?.count || 0; 
    } catch (error) {
      console.error("Error fetching completed tasks count for StatsDisplay:", error.message);
      return 0;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const totalTimeData = await fetchTotalFocusTime();
    const coreStatsData = await fetchUserCoreStats(); // Gets currentCoins
    const totalCoinsEarnedData = await fetchTotalCoinsEarned();
    const coinsSpentData = await fetchCoinsSpent();
    const completedTasksCountData = await fetchCompletedTasksCount(); // Get completed tasks count

    setStats({
      totalTime: totalTimeData,
      currentCoins: coreStatsData.currentCoins,
      completedTasks: completedTasksCountData, // Use the count from the new function
      totalCoinsEarned: totalCoinsEarnedData,
      coinsSpent: coinsSpentData,
    });
    setLoading(false);
  };

  // New functions to update specific stats
  const updateTotalTime = async () => {
    const totalTimeData = await fetchTotalFocusTime();
    setStats(prevStats => ({
      ...prevStats,
      totalTime: totalTimeData
    }));
  };

  const updateCurrentCoins = async () => {
    const coreStatsData = await fetchUserCoreStats();
    setStats(prevStats => ({
      ...prevStats,
      currentCoins: coreStatsData.currentCoins
    }));
  };

  const updateTotalCoinsEarned = async () => {
    const totalCoinsEarnedData = await fetchTotalCoinsEarned();
    setStats(prevStats => ({
      ...prevStats,
      totalCoinsEarned: totalCoinsEarnedData
    }));
  };

  const updateCoinsSpent = async () => {
    const coinsSpentData = await fetchCoinsSpent();
    setStats(prevStats => ({
      ...prevStats,
      coinsSpent: coinsSpentData
    }));
  };

  const updateCompletedTasks = async () => {
    const completedTasksCountData = await fetchCompletedTasksCount();
    setStats(prevStats => ({
      ...prevStats,
      completedTasks: completedTasksCountData
    }));
  };

  useEffect(() => {
    fetchData(); // Initial load of all data

    // Event handlers for specific updates
    const handleCoinUpdate = () => {
      // Update coins-related stats
      updateCurrentCoins();
      updateTotalCoinsEarned();
    };

    const handleStatsUpdate = () => {
      // General stats update - update time
      updateTotalTime();
    };

    const handleTaskCompletionUpdate = () => {
      // Update completed tasks count and coins (tasks give coins)
      updateCompletedTasks();
      updateCurrentCoins();
      updateTotalCoinsEarned();
    };

    const handleCoinSpent = () => {
      // Update coins spent and current coins
      updateCoinsSpent();
      updateCurrentCoins();
    };

    window.addEventListener("coinUpdate", handleCoinUpdate);
    window.addEventListener("statsUpdate", handleStatsUpdate);
    window.addEventListener("taskCompletionUpdate", handleTaskCompletionUpdate);
    window.addEventListener("coinSpent", handleCoinSpent); 

    return () => {
      window.removeEventListener("coinUpdate", handleCoinUpdate);
      window.removeEventListener("statsUpdate", handleStatsUpdate);
      window.removeEventListener("taskCompletionUpdate", handleTaskCompletionUpdate);
      window.removeEventListener("coinSpent", handleCoinSpent);
    };
  }, []);


  const statsArray = [
    { id: 'totalTime', data: stats.totalTime, label: 'TOTAL FOCUS TIME', IconComponent: Clock },
    { id: 'totalCoinsEarned', data: stats.totalCoinsEarned, label: 'TOTAL COINS EARNED', IconComponent: TrendingUp },
    { id: 'currentCoins', data: stats.currentCoins, label: 'YOUR COINS', IconComponent: Coins },
    { id: 'coinsSpent', data: stats.coinsSpent, label: 'COINS SPENT', IconComponent: ShoppingCart },
    { id: 'completedTasks', data: stats.completedTasks, label: 'TASKS COMPLETED', IconComponent: ListChecks },
  ];

  if (loading) {
    return (
      <div className="stats-display-bar loading-placeholder">
        Loading stats...
      </div>
    );
  }

  return (
    <motion.div
      className="stats-display-bar"
      variants={barVariants}
      initial="hidden"
      animate="visible"
    >
      {statsArray.map((statItem) => (
        <motion.div
          key={statItem.id}
          className="stat-item-display"
          variants={itemVariants}
          whileHover={{ scale: 1.03, backgroundColor: "rgba(117, 0, 202, 0.05)", transition: { duration: 0.15 } }}
        >
          <statItem.IconComponent size={26} className="stat-icon-display" />
          <div className="stat-text-display">
            <span className="stat-label-display">{statItem.label}</span>
            <span className="stat-value-display">{statItem.data}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserStatsDisplay;