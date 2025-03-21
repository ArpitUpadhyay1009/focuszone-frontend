import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";

const ProgressBar = ({ currentLevel, nextLevel, progress, timeRemaining, isComplete }) => {
  return (
    <div className="mb-4">
      {/* Current level - completed */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1 
            }}
          >
            <CheckCircle className="w-5 h-5 text-upgrade-green mr-2" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-medium text-gray-800"
          >
            Level {currentLevel}
          </motion.span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-gray-700 font-medium"
        >
          100%
        </motion.span>
      </div>
      
      <div className="h-2 w-full bg-upgrade-gray rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
          className="h-full rounded-full bg-upgrade-green"
        />
      </div>

      {/* Next level - in progress */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <div className="flex items-center">
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="font-medium text-gray-800"
          >
            Level {nextLevel}
          </motion.span>
        </div>
        {timeRemaining && (
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Clock className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-gray-700 font-medium">{timeRemaining}</span>
          </motion.div>
        )}
      </div>
      
      <div className="h-2 w-full bg-upgrade-gray rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 0.2
          }}
          className="h-full rounded-full bg-upgrade-green"
        />
      </div>
    </div>
  );
};

export default ProgressBar;