import { useTheme } from '../../context/ThemeContext.jsx';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCoins, FaArrowUp } from 'react-icons/fa';

const UpgradeConfirmationPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 

  singleUpgradeCost, 
  maxUpgrades, 
  totalCostForMax,
  currentLevel,
  userCoins 
}) => {
  const { theme } = useTheme();

  const handleUpgradeChoice = (upgradeAll) => {
    onConfirm(upgradeAll);
  };

  if (!isOpen) return null;

  // Before rendering, cap maxUpgrades so currentLevel + maxUpgrades <= 50
  const cappedMaxUpgrades = Math.max(0, Math.min(maxUpgrades, 50 - currentLevel));

  if (currentLevel >= 50 || cappedMaxUpgrades === 0) {
    return (
      <AnimatePresence>
        <motion.div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${theme === 'dark' ? 'bg-black/60' : 'bg-black/30'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Max Level Reached</h2>
            <p className="text-gray-600 dark:text-gray-300">You are already at the maximum level (50). No further upgrades are possible.</p>
            <button className="mt-6 px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={onClose}>Close</button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${theme === 'dark' ? 'bg-black/60' : 'bg-black/30'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={`rounded-xl p-6 w-full max-w-md relative shadow-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className={`absolute top-4 right-4 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaTimes size={20} />
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <FaArrowUp className="text-white text-2xl" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Level Upgrade Options
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose how you want to upgrade your level
            </p>
          </div>

          <div className={`space-y-4 mb-6 ${theme === 'dark' ? 'bg-gray-800/50 p-3 rounded-lg' : ''}`}>
            {/* Single Level Upgrade Option */}
            <motion.button
              onClick={() => handleUpgradeChoice(false)}
              className={`w-full p-4 border-2 rounded-lg transition-colors group ${theme === 'dark' ? 'border-gray-600 hover:border-purple-400' : 'border-gray-200 hover:border-purple-500'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className={`font-semibold group-hover:text-purple-600 ${theme === 'dark' ? 'text-white group-hover:text-purple-400' : 'text-gray-800'}`}>
                    Upgrade One Level
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
            {cappedMaxUpgrades > 1 && (
              <motion.button
                onClick={() => handleUpgradeChoice(true)}
                className={`w-full p-4 border-2 rounded-lg transition-colors group ${theme === 'dark' ? 'border-gray-600 hover:border-green-400 bg-gradient-to-r from-green-900/20 to-blue-900/20' : 'border-gray-200 hover:border-green-500 bg-gradient-to-r from-green-50 to-blue-50'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className={`font-semibold group-hover:text-green-600 ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-800'}`}>
                      Upgrade All Possible Levels
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Level {currentLevel} → {currentLevel + cappedMaxUpgrades} ({cappedMaxUpgrades} levels)
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

          <div className={`border rounded-lg p-3 mb-4 ${theme === 'dark' ? 'bg-blue-900/50 border-blue-800/80' : 'bg-blue-50 border-blue-100'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Your Coins:</span>
              <div className="flex items-center text-orange-500 font-bold">
                <FaCoins className="mr-1" />
                {userCoins}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`w-full px-4 py-2 rounded-lg transition-colors border ${theme === 'dark' ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-300'}`}
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

UpgradeConfirmationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  singleUpgradeCost: PropTypes.number.isRequired,
  maxUpgrades: PropTypes.number.isRequired,
  totalCostForMax: PropTypes.number.isRequired,
  currentLevel: PropTypes.number.isRequired,
  userCoins: PropTypes.number.isRequired,
};

export default UpgradeConfirmationPopup;
