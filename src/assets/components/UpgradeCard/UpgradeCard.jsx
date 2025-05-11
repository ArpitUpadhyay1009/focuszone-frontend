import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, ArrowUp, Coins, Award } from "lucide-react";
import axios from "axios";
import CongratsPopup from "../CongratsPopup/CongratsPopup";

const UpgradeCard = () => {
  const [userData, setUserData] = useState({
    currentLevel: 1,
    nextLevel: 2,
    coins: 0,
    progress: 100,
  });

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeProgress, setUpgradeProgress] = useState(0);
  const [canUpgrade, setCanUpgrade] = useState(false);
  const [coinsRequired] = useState(150);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [newLevel, setNewLevel] = useState(2);
  const [showProgressPopup, setShowProgressPopup] = useState(false);

  // Fetch user data
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

        // Update user data without any time-related properties
        setUserData({
          currentLevel: response.data.level || 1,
          nextLevel: (response.data.level || 1) + 1,
          coins: response.data.coins || 0,
          progress: 100,
        });

        // Check if user has enough coins to upgrade
        setCanUpgrade(response.data.coins >= coinsRequired);

        // Also update the newLevel state based on current level
        setNewLevel((response.data.level || 1) + 1);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Listen for coin updates
    window.addEventListener("coinUpdate", fetchUserData);
    return () => window.removeEventListener("coinUpdate", fetchUserData);
  }, [coinsRequired]);

  const handleUpgrade = async () => {
    if (isUpgrading || !canUpgrade) return;

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
  };

  const upgradeUserLevel = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsUpgrading(false);
        setShowProgressPopup(false);
        toast.error("You need to be logged in to upgrade");
        return;
      }

      const response = await axios.patch(
        "/api/auth/updateLevel",
        { coins: coinsRequired }, // Send the cost in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the user data with new level
      const updatedLevel = userData.currentLevel + 1;
      setNewLevel(updatedLevel);

      setUserData((prev) => ({
        ...prev,
        currentLevel: updatedLevel,
        nextLevel: updatedLevel + 1,
        coins: prev.coins - coinsRequired,
      }));

      setUpgradeProgress(0);
      setIsUpgrading(false);
      setShowProgressPopup(false);

      // Show congratulations popup
      setShowCongratsPopup(true);

      // Check if user can still upgrade
      setCanUpgrade(userData.coins - coinsRequired >= coinsRequired);

      // Dispatch coin update event
      window.dispatchEvent(new Event("coinUpdate"));
    } catch (error) {
      console.error("Error upgrading level:", error);
      toast.error("Failed to upgrade level. Please try again.");
      setIsUpgrading(false);
      setUpgradeProgress(0);
      setShowProgressPopup(false);
    }
  };

  const handleCloseCongratsPopup = () => {
    setShowCongratsPopup(false);
    // Reload the page
    window.location.reload();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg"
      >
        {/* Current level display */}
        <div className="mb-6 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full"
          >
            <Award size={20} className="mr-2" />
            <span className="font-bold">
              Current Level: {userData.currentLevel}
            </span>
          </motion.div>
        </div>

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
                  scale: isUpgrading ? [1, 1.1, 1] : 1,
                  transition: {
                    repeat: isUpgrading ? Infinity : 0,
                    duration: 1,
                  },
                }}
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2"
              >
                <CheckCircle size={16} className="text-gray-600" />
              </motion.div>
              <span className="font-medium">Level {userData.nextLevel}</span>
            </div>
            <div className="flex items-center">
              <Coins size={16} className="text-yellow-500 mr-1" />
              <span className="text-sm font-medium">
                {coinsRequired} coins required
              </span>
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

        {/* Upgrade button - centered and styled like the screenshot */}
        <div className="flex justify-center items-center mb-4">
          <motion.button
            whileHover={{ scale: canUpgrade ? 1.05 : 1 }}
            whileTap={{ scale: canUpgrade ? 0.95 : 1 }}
            onClick={handleUpgrade}
            disabled={!canUpgrade || isUpgrading}
            className={`px-6 py-3 rounded-full flex items-center gap-2 shadow-lg ${
              canUpgrade && !isUpgrading
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <ArrowUp size={20} />
            <span className="font-medium">Upgrade</span>
            <div className="bg-orange-400 px-2 py-1 rounded-full flex items-center ml-1">
              <Coins size={14} className="mr-1" />
              <span>{coinsRequired}</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Progress Popup */}
      <AnimatePresence>
        {showProgressPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                Upgrading to Level {userData.nextLevel}
              </h3>

              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${upgradeProgress}%` }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>

              <p className="text-center text-gray-600">
                {upgradeProgress < 100 ? "Please wait..." : "Almost done!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congratulations Popup */}
      <CongratsPopup
        isOpen={showCongratsPopup}
        onClose={handleCloseCongratsPopup}
        newLevel={newLevel}
      />
    </>
  );
};

export default UpgradeCard;

// Add this to the upgrade success handler in UpgradeCard.jsx
// Find the section where the upgrade is successful and add this line:

// After successful upgrade
setUserData((prev) => ({
  ...prev,
  currentLevel: prev.currentLevel + 1,
  nextLevel: prev.nextLevel + 1,
}));

// Dispatch event to notify level was upgraded
window.dispatchEvent(new Event('levelUpgraded'));

// Show congrats popup
setShowCongratsPopup(true);
setNewLevel(userData.currentLevel + 1);
