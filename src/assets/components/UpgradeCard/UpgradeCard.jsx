import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, Clock, ArrowUp, Coins } from "lucide-react";
import axios from "axios";

const UpgradeCard = () => {
  const [userData, setUserData] = useState({
    currentLevel: 1,
    nextLevel: 2,
    coins: 0,
    progress: 0,
    timeRemaining: "20 more minutes"
  });
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [canUpgrade, setCanUpgrade] = useState(false);
  const [coinsRequired, setCoinsRequired] = useState(150);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:3001/api/auth/user-level",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const upgradesResponse = await axios.get(
          "http://localhost:3001/api/auth/can-level-upgrade",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData({
          currentLevel: response.data.level || 1,
          nextLevel: (response.data.level || 1) + 1,
          coins: response.data.coins || 0,
          progress: 100,
          timeRemaining: "20 more minutes"
        });

        setCanUpgrade(upgradesResponse.data.maxLevelUpgrades > 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Listen for coin updates
    window.addEventListener("coinUpdate", fetchUserData);
    return () => window.removeEventListener("coinUpdate", fetchUserData);
  }, []);

  const handleUpgrade = async () => {
    if (isUpgrading || !canUpgrade) return;

    setIsUpgrading(true);
    toast.loading("Upgrading to next level...");

    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setUpgradeProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        
        // After animation completes, call the API to upgrade level
        upgradeUserLevel();
      }
    }, 30);
  };

  const upgradeUserLevel = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsUpgrading(false);
        toast.error("You need to be logged in to upgrade");
        return;
      }

      const response = await axios.patch(
        "http://localhost:3001/api/auth/updateLevel",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the user data with new level
      setUserData(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        nextLevel: prev.nextLevel + 1,
        coins: prev.coins - coinsRequired
      }));

      setUpgradeProgress(0);
      setIsUpgrading(false);
      
      toast.success(`Successfully upgraded to Level ${userData.currentLevel + 1}!`);
      
      // Check if user can still upgrade
      const upgradesResponse = await axios.get(
        "http://localhost:3001/api/auth/can-level-upgrade",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setCanUpgrade(upgradesResponse.data.maxLevelUpgrades > 0);
      
    } catch (error) {
      console.error("Error upgrading level:", error);
      toast.error("Failed to upgrade level. Please try again.");
      setIsUpgrading(false);
      setUpgradeProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg"
    >
      {/* Current level - completed */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2"
            >
              <CheckCircle size={16} className="text-white" />
            </motion.div>
            <span className="font-medium">Level {userData.currentLevel}</span>
          </div>
          <span className="text-sm font-medium">100%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
            className="h-full bg-green-500 rounded-full"
          />
        </div>
      </div>

      {/* Next level - in progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <motion.div
              animate={{ 
                rotate: isUpgrading ? 360 : 0,
                transition: { repeat: isUpgrading ? Infinity : 0, duration: 2 }
              }}
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2"
            >
              <Clock size={16} className="text-gray-600" />
            </motion.div>
            <span className="font-medium">Level {userData.nextLevel}</span>
          </div>
          <div className="flex items-center">
            <Coins size={16} className="text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{coinsRequired} coins required</span>
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${upgradeProgress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* Coins display */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Coins size={20} className="text-yellow-500 mr-2" />
          <span className="font-medium">Your coins:</span>
        </div>
        <motion.span
          key={userData.coins}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-bold text-lg"
        >
          {userData.coins}
        </motion.span>
      </div>

      {/* Upgrade button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: canUpgrade ? 1.05 : 1 }}
          whileTap={{ scale: canUpgrade ? 0.95 : 1 }}
          onClick={handleUpgrade}
          disabled={!canUpgrade || isUpgrading}
          className={`px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 ${
            canUpgrade && !isUpgrading
              ? "bg-yellow-400 text-black hover:bg-yellow-500"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          <ArrowUp size={20} />
          <span className="font-medium">
            {isUpgrading ? "Upgrading..." : "Upgrade"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UpgradeCard;
