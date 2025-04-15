import { motion } from "framer-motion";
import { CheckCircle, Coins } from "lucide-react";

const ProgressBar = ({
  level,
  progress,
  isComplete,
  coinsRequired = 150,
  darkMode = false,
}) => {
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
              className={isComplete 
                ? "text-white" 
                : darkMode 
                  ? "text-gray-400" 
                  : "text-gray-600"
              } 
            />
          </motion.div>
          <span className={`text-xs font-medium ${darkMode ? "text-white" : ""}`}>
            Level {level}
          </span>
        </div>
        <span className={`text-xs font-medium ${darkMode ? "text-white" : ""}`}>
          {isComplete ? "100%" : (
            <div className="flex items-center">
              <Coins size={10} className={darkMode ? "text-yellow-400" : "text-yellow-500"} />
              <span>{coinsRequired} coins</span>
            </div>
          )}
        </span>
      </div>
      <div className={`h-1.5 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${isComplete ? 100 : progress}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${
            isComplete ? "bg-green-500" : "bg-purple-500"
          } rounded-full`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
