import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
import UpgradeButton from "../UpgradeButton/UpgradeButton.jsx";

const UpgradeCard = () => {
  const [currentLevel, setCurrentLevel] = useState(13);
  const [nextLevelProgress, setNextLevelProgress] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("20 more minutes");

  const handleUpgrade = () => {
    if (isUpgrading) return;

    setIsUpgrading(true);
    toast.loading("Upgrading to next level...");

    // Simulate progress animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setNextLevelProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // After progress completes, update the level
        setTimeout(() => {
          setCurrentLevel((prevLevel) => prevLevel + 1);
          setNextLevelProgress(0);
          setIsUpgrading(false);
          toast.success(`Successfully upgraded to Level ${currentLevel + 1}!`);
        }, 500);
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg"
    >
      {/* Current level - completed */}
      <ProgressBar level={currentLevel} progress={100} isComplete={true} />

      {/* Next level - in progress */}
      {/* <ProgressBar 
        level={currentLevel + 1} 
        progress={nextLevelProgress} 
        timeRemaining={timeRemaining}
        isComplete={false} 
      /> */}

      <div className="flex justify-end mt-6">
        <UpgradeButton onClick={handleUpgrade} isUpgrading={isUpgrading} />
      </div>
    </motion.div>
  );
};

export default UpgradeCard;
