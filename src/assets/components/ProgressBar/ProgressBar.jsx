import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";

const ProgressBar = ({
  level,
  progress,
  timeRemaining,
  isComplete,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-8 h-8 rounded-full ${
              isComplete ? "bg-green-500" : "bg-gray-300"
            } flex items-center justify-center mr-2`}
          >
            {isComplete ? (
              <CheckCircle size={16} className="text-white" />
            ) : (
              <motion.div
                animate={{ 
                  rotate: 360,
                  transition: { repeat: Infinity, duration: 2 }
                }}
              >
                <Clock size={16} className="text-gray-600" />
              </motion.div>
            )}
          </motion.div>
          <span className="font-medium">Level {level}</span>
        </div>
        <span className="text-sm font-medium">
          {isComplete ? "100%" : timeRemaining}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
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
