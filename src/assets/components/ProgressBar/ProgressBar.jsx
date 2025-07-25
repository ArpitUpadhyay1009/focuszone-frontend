import { motion } from "framer-motion";
import { CheckCircle, Coins } from "lucide-react";
import PropTypes from "prop-types";

const ProgressBar = ({
  level,
  isComplete,
  coinsRequired,
  darkMode = false,
  userCoins,
  showLevelText = true
}) => {
  // Calculate coin progress as a percentage
  const coinProgress = Math.min((userCoins / coinsRequired) * 100, 100);

  // Determine bar color
  const progressColor =
    coinProgress >= 100 ? "bg-green-500" : "bg-yellow-400";

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-5 h-5 rounded-full ${
              isComplete
                ? "bg-green-500"
                : darkMode
                ? "bg-gray-600"
                : "bg-gray-300"
            } flex items-center justify-center mr-1.5`}
          >
            <CheckCircle
              size={12}
              className={
                isComplete
                  ? "text-white"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }
            />
          </motion.div>
          {showLevelText && (
            <span className={`text-xs font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              Level {level}
            </span>
          )}
        </div>
        <div className="flex items-center text-xs font-medium space-x-1">
          <Coins size={10} className={darkMode ? "text-yellow-400" : "text-yellow-500"} />
          <span className={darkMode ? "text-white" : "text-gray-800"}>
            {isComplete
              ? "100%"
              : (coinsRequired === null || coinsRequired === undefined || isNaN(coinsRequired))
                ? `${userCoins} / – required`
                : `${userCoins} / ${coinsRequired} required`}
          </span>
        </div>
      </div>

      {!isComplete && (
        <div className={`h-1.5 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${coinProgress}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${progressColor} rounded-full`}
          />
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  level: PropTypes.number.isRequired,
  isComplete: PropTypes.bool.isRequired,
  coinsRequired: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  darkMode: PropTypes.bool,
  userCoins: PropTypes.number.isRequired,
  showLevelText: PropTypes.bool
};

export default ProgressBar;
