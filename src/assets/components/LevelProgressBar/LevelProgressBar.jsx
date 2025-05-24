import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowUp, Coins } from "lucide-react";
import "./LevelProgressBar.css";

const LevelProgressBar = ({ 
  userData, 
  canUpgrade, 
  coinsRequired, 
  handleUpgrade, 
  isUpgrading 
}) => {
  return (
    <div className="level-progress-container">
      <h2>Level Progress</h2>
      
      {/* Current level - completed */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <CheckCircle size={14} className="text-white" />
            </div>
            <span>Level {userData.currentLevel}</span>
          </div>
          <span>100%</span>
        </div>
        <div className="level-progress-bar">
          <div className="level-progress-fill completed w-full" />
        </div>
      </div>
      
      {/* Next level */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center mr-2">
              <CheckCircle size={14} className="text-gray-300" />
            </div>
            <span>Level {userData.nextLevel}</span>
          </div>
          <div className="flex items-center">
            <Coins size={14} className="text-yellow-500 mr-1" />
            <span>{coinsRequired} coins</span>
          </div>
        </div>
        <div className="level-progress-bar">
          <div className="level-progress-fill next w-0" />
        </div>
      </div>
      
      {/* Status row */}
      <div className="status-row">
        <div className="flex items-center">
          <span>Can upgrade: </span>
          <span className="can-upgrade ml-1">{canUpgrade ? "Yes" : "No"}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Your coins:</span>
          <div className="coin-display">
            <Coins size={14} className="text-yellow-500 mr-1" />
            <span className="font-bold">{userData.coins}</span>
          </div>
        </div>
      </div>
      
      {/* Upgrade button - centered */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpgrade}
        disabled={!canUpgrade || isUpgrading}
        className="upgrade-button"
      >
        <ArrowUp size={18} className="mr-2" />
        <span>Upgrade</span>
        <div className="coin-pill">
          <Coins size={14} className="mr-1" />
          <span>{coinsRequired}</span>
        </div>
      </motion.button>
      
      // Inside your component where the popup is rendered
      {showProgressPopup && (
        <div className="upgrading-overlay">
          <div className="upgrading-popup">
            <h3>Upgrading to Level {userData.nextLevel}</h3>
            <div className="upgrading-progress-bar">
              <div 
                className="upgrading-progress-fill" 
                style={{ width: `${upgradeProgress}%` }}
              />
            </div>
            <p>{upgradeProgress < 100 ? "Please wait..." : "Almost done!"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelProgressBar;