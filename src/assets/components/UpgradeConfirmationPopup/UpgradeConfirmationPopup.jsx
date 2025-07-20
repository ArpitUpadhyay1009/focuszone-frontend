import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCoins, FaArrowUp } from 'react-icons/fa';

const UpgradeConfirmationPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  upgradeType, 
  singleUpgradeCost, 
  maxUpgrades, 
  totalCostForMax,
  currentLevel,
  userCoins 
}) => {
  const handleUpgradeChoice = (upgradeAll) => {
    onConfirm(upgradeAll);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaTimes size={20} />
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <FaArrowUp className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Level Upgrade Options
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose how you want to upgrade your level
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {/* Single Level Upgrade Option */}
            <motion.button
              onClick={() => handleUpgradeChoice(false)}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Upgrade One Level
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Level {currentLevel} → {currentLevel + 1}
                  </p>
                </div>
                <div className="flex items-center text-orange-500">
                  <FaCoins className="mr-1" />
                  <span className="font-bold">{singleUpgradeCost}</span>
                </div>
              </div>
            </motion.button>

            {/* Multiple Levels Upgrade Option */}
            {maxUpgrades > 1 && (
              <motion.button
                onClick={() => handleUpgradeChoice(true)}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors group bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                      Upgrade All Possible Levels
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Level {currentLevel} → {currentLevel + maxUpgrades} ({maxUpgrades} levels)
                    </p>
                  </div>
                  <div className="flex items-center text-orange-500">
                    <FaCoins className="mr-1" />
                    <span className="font-bold">{totalCostForMax}</span>
                  </div>
                </div>
              </motion.button>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700 dark:text-blue-300">Your Coins:</span>
              <div className="flex items-center text-orange-500 font-bold">
                <FaCoins className="mr-1" />
                {userCoins}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradeConfirmationPopup;
