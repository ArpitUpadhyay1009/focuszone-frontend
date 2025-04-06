import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Coins } from "lucide-react";
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
import UpgradeButton from "../UpgradeButton/UpgradeButton.jsx";

const LevelUpgradeSystem = () => {
  const [userData, setUserData] = useState({
    level: 1,
    coins: 300,
    progress: 0,
    timeSpent: 30,
    timeNeeded: 60,
  });
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeProgress, setTimeProgress] = useState(0);
  const [maxUpgrades, setMaxUpgrades] = useState(0);

  // The cost to upgrade a level (fixed at 150 coins based on backend)
  const UPGRADE_COST = 150;

  // // Mock API responses for demo purposes
  // const mockUserData = {
  //   level: 3,
  //   coins: 300,
  //   timeSpent: 30,
  //   timeNeeded: 60
  // };

  // const mockUpgradeableData = {
  //   maxLevelUpgrades: 2,
  //   currentLevel: 3
  // };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);

        // In a real app, you would uncomment this code to fetch from your API

        // Fetch user level data
        const response = await fetch(
          "http://localhost:3001/api/auth/user-level",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store token in localStorage
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log(data);

        // Fetch max possible upgrades with current coins
        const upgradesResponse = await fetch(
          "http://localhost:3001/api/auth/can-level-upgrade",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!upgradesResponse.ok) {
          throw new Error("Failed to fetch upgradable levels");
        }

        const upgradesData = await upgradesResponse.json();

        // Using mock data for demonstration
        // const data = mockUserData;
        // const upgradesData = mockUpgradeableData;

        setMaxUpgrades(upgradesData.maxLevelUpgrades);

        // Construct user data from response
        setUserData({
          level: data.level || 1,
          coins: data.coins || 0,
          progress: 100,
        });

        // Check for pomodoro time spent
        const storedTimeStr = localStorage.getItem("pomodoroTimeSpent");
        if (storedTimeStr) {
          const storedTime = parseInt(storedTimeStr, 10);
          if (!isNaN(storedTime)) {
            const timeProgress = Math.min(100, (storedTime / 60) * 100);
            setTimeProgress(timeProgress);
            setUserData((prev) => ({
              ...prev,
              timeSpent: storedTime,
            }));
          }
        } else {
          // For demo purposes, we'll use the mock data
          const timeProgress = Math.min(
            100,
            (data.timeSpent / data.timeNeeded) * 100
          );
          setTimeProgress(timeProgress);
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

  // Listen for localStorage updates from Timer component
  useEffect(() => {
    const checkPomodoroTime = () => {
      const storedTimeStr = localStorage.getItem("pomodoroTimeSpent");
      if (storedTimeStr) {
        const storedTime = parseInt(storedTimeStr, 10);
        if (!isNaN(storedTime)) {
          setUserData((prev) => {
            const updatedTimeSpent = storedTime;
            const timeProgress = Math.min(
              100,
              (updatedTimeSpent / prev.timeNeeded) * 100
            );
            setTimeProgress(timeProgress);
            return {
              ...prev,
              timeSpent: updatedTimeSpent,
            };
          });
        }
      }
    };

    // Add storage event listener
    window.addEventListener("storage", checkPomodoroTime);

    // Check initially
    checkPomodoroTime();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("storage", checkPomodoroTime);
    };
  }, []);

  const handleUpgrade = async () => {
    if (userData.coins < UPGRADE_COST) {
      toast.error(
        `Not enough coins! You need ${UPGRADE_COST} coins to upgrade.`
      );
      return;
    }

    try {
      setIsUpgrading(true);
      toast.loading("Upgrading your level...");

      // Simulate progress animation
      let progress = userData.progress;
      const interval = setInterval(() => {
        progress += 5;
        setUserData((prev) => ({ ...prev, progress: Math.min(progress, 100) }));

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);

      // In a real app, you would uncomment this code to call your API

      // Call API to upgrade the level
      const response = await fetch(
        "http://localhost:3001/api/auth/updateLevel",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            toLevel: Number(userData.level) + 1,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upgrade level");
      }

      let result = await response.json();

      // For demo, we'll simulate a successful response
      result = {
        newLevel: userData.level + 1,
        newCoins: userData.coins - UPGRADE_COST,
      };

      clearInterval(interval);

      // Update user data with new level and remaining coins
      setTimeout(() => {
        setUserData((prev) => ({
          ...prev,
          level: result.newLevel,
          coins: result.newCoins,
          progress: 0,
        }));

        // Update max upgrades possible
        setMaxUpgrades((prev) => Math.max(0, prev - 1));

        setIsUpgrading(false);
        toast.dismiss();
        toast.success(`Successfully upgraded to Level ${result.newLevel}!`);
      }, 2000); // Longer timeout to show the animation
    } catch (error) {
      console.error("Upgrade failed:", error);
      setIsUpgrading(false);
      toast.dismiss();
      toast.error(
        error.message || "Something went wrong. Please try again later."
      );
    }
  };

  // Calculate time remaining
  const formatTimeRemaining = () => {
    const minutesLeft = Math.max(0, userData.timeNeeded - userData.timeSpent);
    if (minutesLeft <= 0) return "Ready to upgrade!";
    if (minutesLeft === 1) return "1 more minute";
    return `${minutesLeft} more minutes`;
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center items-center">
        <motion.div
          className="h-16 w-16 border-4 border-upgrade-green border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-6 bg-white rounded-xl shadow-sm mb-4 backdrop-blur-sm bg-opacity-90"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Level Progress
      </h3>

      {/* Level progress bar */}
      <ProgressBar
        currentLevel={userData.level}
        nextLevel={userData.level + 1}
        progress={userData.progress}
        timeRemaining={formatTimeRemaining()}
        isComplete={userData.progress === 100}
      />

      {/* Timer progress bar - shows how much time spent on the timer */}
      {/* <div className="mt-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Timer Progress
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(timeProgress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-upgrade-gray rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${timeProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-upgrade-green"
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {userData.timeSpent} / {userData.timeNeeded} minutes
        </div>
      </div> */}

      <div className="flex justify-between items-center mt-5">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Available upgrades: </span>
          <span className="text-upgrade-orange font-bold">{maxUpgrades}</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2"
        >
          <span className="text-sm font-medium text-gray-700">Your coins:</span>
          <div className="flex items-center px-3 py-1 bg-amber-50 rounded-md border border-amber-200">
            <Coins className="w-4 h-4 text-amber-500 mr-1" />
            <span className="font-semibold text-amber-600">
              {userData.coins}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="mt-4 flex justify-end">
        <UpgradeButton
          onClick={handleUpgrade}
          isUpgrading={isUpgrading}
          coinsRequired={UPGRADE_COST}
          coinsAvailable={userData.coins}
        />
      </div>
    </motion.div>
  );
};

export default LevelUpgradeSystem;
