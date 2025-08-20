import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Coins } from "lucide-react";
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
import UpgradeButton from "../UpgradeButton/UpgradeButton.jsx";
import CongratsPopup from "../CongratsPopup/CongratsPopup.jsx";
import UpgradeConfirmationPopup from "../UpgradeConfirmationPopup/UpgradeConfirmationPopup.jsx";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext.jsx";

// Mapping of levels to their unlockable items
const levelUnlocks = {
  1: "Starting Level",
  2: "Bed",
  3: "Side Table with a lamp",
  4: "Bookshelves",
  5: "Storage",
  6: "Rug",
  7: "Center table",
  8: "Books",
  9: "Computer Setup",
  10: "Boxes for storage",
  11: "Exercising Equipment",
  12: "Pictures on the wall",
  13: "Coffee and Cookies",
  14: "Clock",
  15: "Cactus Plant on the window",
  16: "Houseplant",
  17: "Stationary",
  18: "Slippers",
  19: "Dustbin",
  20: "Moon Lamp",
  21: "Jewellery Box",
  22: "Succulent House Pot",
  23: "Picture frame",
  24: "Additional books",
  25: "Laundry baskets",
  26: "Rubik's cube",
  27: "Candles",
  28: "Additional Books",
  29: "Globe",
  30: "Climber house plant",
  31: "Snake house plant",
  32: "Double floor layout",
  33: "Single couch",
  34: "Rectangle table",
  35: "Center Table",
  36: "Side table for the couch",
  37: "Aquarium",
  38: "More storage",
  39: "Hangers",
  40: "Carpet",
  41: "Pictures",
  42: "Large Houseplant",
  43: "Jacket",
  44: "Books and useful stuff",
  45: "Teddy Bear",
  46: "Side Table with book",
  47: "House plant near the window",
  48: "Coffee and Cookies",
  49: "Food Plate",
  50: "Cat",
};

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
  const [upgradeCost, setUpgradeCost] = useState(null);
  const [showUpgradeConfirmation, setShowUpgradeConfirmation] = useState(false);
  const [maxUpgrades, setMaxUpgrades] = useState(0);
  const [totalCostForMax, setTotalCostForMax] = useState(0);
  const [isMultipleUpgrade, setIsMultipleUpgrade] = useState(false);
  const [targetLevel, setTargetLevel] = useState(1);

  // The cost to upgrade a level (fixed at 150 coins)
  const fetchUpgradableLevels = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await axios.get("/api/auth/can-level-upgrade", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { upgradeCost, maxLevelUpgrades } = response.data;
      setUpgradeCost(upgradeCost);
      setMaxUpgrades(maxLevelUpgrades || 0);

      // Calculate total cost for max upgrades
      if (maxLevelUpgrades > 0) {
        let totalCost = 0;
        let tempLevel = userData.level;
        for (let i = 0; i < maxLevelUpgrades; i++) {
          totalCost += getLevelUpgradeCost(tempLevel + 1 + i);
        }
        setTotalCostForMax(totalCost);
      }

      console.log(
        "Set upgradeCost:",
        upgradeCost,
        "maxUpgrades:",
        maxLevelUpgrades
      );
    } catch (error) {
      console.error(
        "Error fetching upgrade cost:",
        error.response?.data || error.message
      );
    }
  };

  // Helper function to calculate upgrade cost (should match backend logic)
  const getLevelUpgradeCost = (level) => {
    if (level < 2) return 1;
    if (level <= 5) return 3;
    if (level <= 8) return 5;
    if (level <= 12) return 10;
    if (level <= 20) return 20;
    if (level <= 30) return 30;
    if (level <= 33) return 40;
    if (level <= 36) return 50;
    if (level <= 39) return 60;
    if (level <= 42) return 70;
    if (level <= 45) return 80;
    if (level <= 48) return 100;
    if (level <= 51) return 120;
    if (level <= 54) return 150;
    if (level <= 57) return 180;
    if (level <= 60) return 210;
    if (level <= 63) return 240;
    if (level <= 66) return 270;
    if (level <= 69) return 300;
    if (level <= 72) return 350;
    if (level <= 75) return 400;
    if (level <= 78) return 450;
    if (level <= 81) return 500;
    if (level <= 83) return 600;
    return Infinity;
  };

  useEffect(() => {
    fetchUpgradableLevels();
  }, []);

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
        coins: prev.coins - upgradeCost,
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
    if (userData.coins < upgradeCost) {
      toast.error(
        `Not enough coins! You need ${upgradeCost} coins to upgrade.`
      );
      return;
    }

    // If only one level is available to upgrade, directly upgrade without showing popup
    if (maxUpgrades === 1) {
      handleUpgradeConfirm(false); // false means single upgrade, not upgrade all
      return;
    }

    // Show confirmation popup for multiple upgrade options
    setShowUpgradeConfirmation(true);
  };

  const handleUpgradeConfirm = async (upgradeAll) => {
    setShowUpgradeConfirmation(false);
    setIsMultipleUpgrade(upgradeAll);

    // Set target level based on upgrade type
    if (upgradeAll) {
      setTargetLevel(userData.level + maxUpgrades);
    } else {
      setTargetLevel(userData.level + 1);
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

          // After animation completes, call the appropriate API
          if (upgradeAll) {
            upgradeMultipleLevels();
          } else {
            upgradeUserLevel();
          }
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

  const upgradeMultipleLevels = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsUpgrading(false);
        setShowProgressPopup(false);
        toast.error("You need to be logged in to upgrade");
        return;
      }

      console.log("Sending multiple upgrade request");

      const response = await axios.patch(
        "/api/auth/updateMultipleLevels",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Multiple upgrade response:", response.data);

      // Update user data with new level and remaining coins
      setUserData((prev) => ({
        ...prev,
        level: response.data.newLevel,
        coins: response.data.newCoins,
        progress: 100,
      }));

      setNewLevel(response.data.newLevel);
      setIsUpgrading(false);
      setShowProgressPopup(false);

      // Show congratulations popup
      setShowCongratsPopup(true);

      // Show success message
      toast.success(
        `Upgraded ${response.data.levelsUpgraded} levels! Spent ${response.data.totalCostSpent} coins.`
      );

      // Dispatch coin update event to refresh other components
      window.dispatchEvent(new Event("coinUpdate"));

      // Refresh upgrade data
      fetchUpgradableLevels();
    } catch (error) {
      console.error("Multiple upgrade failed:", error);
      setIsUpgrading(false);
      setShowProgressPopup(false);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again later."
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
        className={`md:w-100 lg:w-112 ml-[0%] sm:w-100 p-6 rounded-xl shadow-sm mb-3 backdrop-blur-sm ${
          theme === "dark"
            ? "bg-black text-white bg-opacity-90"
            : "bg-white text-black bg-opacity-90"
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Level Progress
        </h3>

        {/* Current level progress bar */}
        {/* <ProgressBar
          level={userData.level}
          progress={100}
          isComplete={true}
          coinsRequired={upgradeCost}
          darkMode={theme === "dark"}
          userCoins={userData.coins}
          showLevelText={false}
        /> */}

        {/* Next level */}
        <div className="mb-2">
          <ProgressBar
            level={userData.level + 1}
            progress={0}
            isComplete={false}
            coinsRequired={upgradeCost}
            darkMode={theme === "dark"}
            userCoins={userData.coins}
            showLevelText={true}
          />
          {userData.level < 50 && (
            <p
              className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Next Level Unlocks: {levelUnlocks[userData.level + 1]}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mt-3">
          <div
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
          </div>

          <div className="flex items-center">
            <UpgradeButton
              onClick={handleUpgrade}
              isUpgrading={isUpgrading}
              coinsRequired={upgradeCost}
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
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`p-8 rounded-xl shadow-xl max-w-md w-full ${
                theme === "dark"
                  ? "bg-gray-800 text-white bg-opacity-90"
                  : "bg-white text-black bg-opacity-90"
              }`}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                {isMultipleUpgrade
                  ? `Upgrading to Level ${targetLevel}`
                  : `Upgrading to Level ${userData.level + 1}`}
              </h3>

              <div
                className={`w-full h-4 rounded-full overflow-hidden mb-4 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${upgradeProgress}%` }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>

              <p
                className={`text-center ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {upgradeProgress < 100 ? "Please wait..." : "Almost done!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Confirmation Popup */}
      <UpgradeConfirmationPopup
        isOpen={showUpgradeConfirmation}
        onClose={() => setShowUpgradeConfirmation(false)}
        onConfirm={handleUpgradeConfirm}
        singleUpgradeCost={upgradeCost}
        maxUpgrades={maxUpgrades}
        totalCostForMax={totalCostForMax}
        currentLevel={userData.level}
        userCoins={userData.coins}
      />

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
