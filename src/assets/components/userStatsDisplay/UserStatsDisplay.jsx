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

  const fetchUserCoreStats = async () => { // Fetches currentCoins and completedTasks
    try {
      const token = localStorage.getItem("token");
      if (!token) return { currentCoins: 0, completedTasks: 0 };
      const response = await axios.get("/api/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        return {
          currentCoins: response.data.currentCoins || 0,
          completedTasks: response.data.completedTasksCount || 0,
        };
      }
      return { currentCoins: 0, completedTasks: 0 };
    } catch (error) {
      console.error("Error fetching user core stats for StatsDisplay:", error.message);
      return { currentCoins: 0, completedTasks: 0 };
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

  const fetchData = async () => {
    setLoading(true);
    const totalTimeData = await fetchTotalFocusTime();
    const coreStatsData = await fetchUserCoreStats();
    const totalCoinsEarnedData = await fetchTotalCoinsEarned();
    const coinsSpentData = await fetchCoinsSpent();

    setStats({
      totalTime: totalTimeData,
      currentCoins: coreStatsData.currentCoins,
      completedTasks: coreStatsData.completedTasks,
      totalCoinsEarned: totalCoinsEarnedData,
      coinsSpent: coinsSpentData,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const handleDataUpdate = () => {
      // console.log("StatsDisplay: Update event detected, refreshing stats...");
      fetchData();
    };

    window.addEventListener("coinUpdate", handleDataUpdate);
    window.addEventListener("statsUpdate", handleDataUpdate);
    window.addEventListener("taskCompletionUpdate", handleDataUpdate);
    window.addEventListener("coinSpent", handleDataUpdate); 

    return () => {
      window.removeEventListener("coinUpdate", handleDataUpdate);
      window.removeEventListener("statsUpdate", handleDataUpdate);
      window.removeEventListener("taskCompletionUpdate", handleDataUpdate);
      window.removeEventListener("coinSpent", handleDataUpdate);
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
      {statsArray.map((statItem) => ( // Removed index as divider is gone
        // Removed React.Fragment as it's no longer needed without the divider
        <motion.div
          key={statItem.id} // Added key directly to the motion.div
          className="stat-item-display"
          variants={itemVariants}
          whileHover={{ scale: 1.03, backgroundColor: "rgba(117, 0, 202, 0.05)", transition: { duration: 0.15 } }}
          // Added a subtle hover background for dark theme consistency with UserProfileMenu
        >
          <statItem.IconComponent size={26} className="stat-icon-display" /> {/* Increased icon size */}
          <div className="stat-text-display">
            <span className="stat-label-display">{statItem.label}</span>
            <span className="stat-value-display">{statItem.data}</span>
          </div>
        </motion.div>
        // Removed divider rendering logic
      ))}
    </motion.div>
  );
};

export default UserStatsDisplay;