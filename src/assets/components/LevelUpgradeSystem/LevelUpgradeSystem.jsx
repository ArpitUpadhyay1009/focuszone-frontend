import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Coins } from "lucide-react";
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
import UpgradeButton from "../UpgradeButton/UpgradeButton.jsx";
import CongratsPopup from "../CongratsPopup/CongratsPopup.jsx";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext.jsx";

const LevelUpgradeSystem = () => {
  const { theme } = useTheme();
  const [userData, setUserData] = useState({
    level: 1,
    coins: 300,
    progress: 100,
  });
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [showProgressPopup, setShowProgressPopup] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  // The cost to upgrade a level (fixed at 150 coins)

var UPGRADE_COST=0;
async function fetchUpgradableLevels() {
  try {
    const response = await axios.get("/api/auth/can-level-upgrade", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = response.data;

    console.log("Max Level Upgrades:", data.maxLevelUpgrades);
    console.log("Current Level:", data.currentLevel);
    UPGRADE_COST = data.upgradeCost;

    return data;
  } catch (error) {
    console.error("Error fetching upgradable levels:", error.response?.data?.message || error.message);
  }
}

fetchUpgradableLevels()

  

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch user level data
        const response = await fetch("/api/auth/user-level", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        // Construct user data from response
        setUserData({
          level: data.level || 1,
          coins: data.coins || 0,
          progress: 100,
        });

        setNewLevel((data.level || 1) + 1);
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast.error("Failed to load your progress. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Listen for coin updates
  useEffect(() => {
    const handleCoinUpdate = () => {
      // Refresh user data when coins are updated
      fetchUserData();
    };

    // Add event listener for coin updates
    window.addEventListener("coinUpdate", handleCoinUpdate);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("coinUpdate", handleCoinUpdate);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/user-level", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      setUserData({
        level: data.level || 1,
        coins: data.coins || 0,
        progress: 100,
      });

      setNewLevel((data.level || 1) + 1);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const upgradeUserLevel = async () => {
    try {
      // Call API to upgrade the level
      const token = localStorage.getItem("token");
      if (!token) {
        setIsUpgrading(false);
        setShowProgressPopup(false);
        toast.error("You need to be logged in to upgrade");
        return;
      }

      console.log("Sending upgrade request");

      const response = await axios.patch(
        "/api/auth/updateLevel",
        {}, // No need to send any data, the backend will handle it
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upgrade response:", response.data);

      // Update user data with new level and remaining coins
      setUserData((prev) => ({
        ...prev,
        level: prev.level + 1,
        coins: prev.coins - UPGRADE_COST,
        progress: 100,
      }));

      setNewLevel((prevLevel) => prevLevel + 1);
      setIsUpgrading(false);
      setShowProgressPopup(false);

      // Show congratulations popup
      setShowCongratsPopup(true);

      // Dispatch coin update event to refresh other components
      window.dispatchEvent(new Event("coinUpdate"));
    } catch (error) {
      console.error("Upgrade failed:", error);
      setIsUpgrading(false);
      setShowProgressPopup(false);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  const handleUpgrade = async () => {
    if (userData.coins < UPGRADE_COST) {
      toast.error(
        `Not enough coins! You need ${UPGRADE_COST} coins to upgrade.`
      );
      return;
    }

    try {
      setIsUpgrading(true);
      setShowProgressPopup(true);

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
    } catch (error) {
      console.error("Upgrade failed:", error);
      setIsUpgrading(false);
      setShowProgressPopup(false);
      toast.error(
        error.message || "Something went wrong. Please try again later."
      );
    }
  };

  // In the LevelUpgradeSystem component:

  // Add a new state variable for max level
  const [isMaxLevel, setIsMaxLevel] = useState(false);

  // Update the handleCloseCongratsPopup function
  const handleCloseCongratsPopup = (reachedMaxLevel = false) => {
    setShowCongratsPopup(false);

    // Update max level state if needed
    if (reachedMaxLevel) {
      setIsMaxLevel(true);
    }

    // Reload the page
    window.location.reload();
  };

  // Update the useEffect that loads user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch user level data
        const response = await fetch("/api/auth/user-level", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        const currentLevel = data.level || 1;

        // Construct user data from response
        setUserData({
          level: currentLevel,
          coins: data.coins || 0,
          progress: 100,
        });

        setNewLevel(currentLevel + 1);

        // Check if user is at max level (50)
        if (currentLevel >= 50) {
          setIsMaxLevel(true);
        } else {
          setIsMaxLevel(false);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast.error("Failed to load your progress. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Update the return statement to properly pass isMaxLevel to UpgradeButton
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full p-3 rounded-xl shadow-sm mb-3 backdrop-blur-sm ${
          theme === "dark" 
            ? "bg-black text-white bg-opacity-90" 
            : "bg-white text-black bg-opacity-90"
        }`}
      >
        <h3 className={`text-lg font-semibold mb-2 ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}>
          Level Progress
        </h3>

        {/* Level progress bar */}
        <ProgressBar
          level={userData.level}
          progress={100}
          isComplete={true}
          coinsRequired={UPGRADE_COST}
          darkMode={theme === "dark"}

        />

        {/* Next level */}
        <ProgressBar
          level={userData.level + 1}
          progress={0}
          isComplete={false}
          coinsRequired={UPGRADE_COST}
          darkMode={theme === "dark"}
          userCoins = {userData.coins}
        />

        <div className="flex justify-between items-center mt-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-1"
          >
            <span
              className={`text-xs font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
            >
              Your coins:
            </span>
            <div
              className={`flex items-center px-2 py-0.5 rounded-md border ${
                theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-amber-50 border-amber-200"
              }`}
            >
            <Coins
              className={`w-3 h-3 mr-1 ${
              theme === "dark" ? "text-yellow-400" : "text-amber-500"
              }`}
            />
          <span
            className={`font-semibold ${
            theme === "dark" ? "text-yellow-400" : "text-amber-600"
          }`}
          >
          {userData.coins}
          </span>
        </div>
      </motion.div>

    <div className="flex items-center">
      <UpgradeButton
        onClick={handleUpgrade}
        isUpgrading={isUpgrading}
        coinsRequired={UPGRADE_COST}
        coinsAvailable={userData.coins}
        isMaxLevel={isMaxLevel}
        darkMode={theme === "dark"}
        small={true}
        />
    </div>
  </div>
      </motion.div>

      {/* Progress Popup */}
      <AnimatePresence>
        {showProgressPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              backdropFilter: 'blur(8px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`p-8 rounded-xl shadow-xl max-w-md w-full ${
                theme === "dark" ? "bg-gray-800 text-white bg-opacity-90" : "bg-white text-black bg-opacity-90"
              }`}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                Upgrading to Level {userData.level + 1}
              </h3>

              <div className={`w-full h-4 rounded-full overflow-hidden mb-4 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${upgradeProgress}%` }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>

              <p className={`text-center ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}>
                {upgradeProgress < 100 ? "Please wait..." : "Almost done!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Make sure the CongratsPopup is properly included */}
      <CongratsPopup
        isOpen={showCongratsPopup}
        onClose={handleCloseCongratsPopup}
        newLevel={newLevel}
        darkMode={theme === "dark"}
      />
    </>
  );
};

export default LevelUpgradeSystem;
