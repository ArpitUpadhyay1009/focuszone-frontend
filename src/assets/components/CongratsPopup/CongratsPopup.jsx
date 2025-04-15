import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";

const CongratsPopup = ({ isOpen, onClose, newLevel }) => {
  const MAX_LEVEL = 50; // Set to exactly 50 (the final level)
  const isMaxLevel = newLevel - 1 >= MAX_LEVEL; // Check if current level (newLevel - 1) is at or above MAX_LEVEL
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation when popup opens
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (error) {
        console.error("Error with confetti:", error);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className={`rounded-2xl p-8 max-w-sm w-full text-center shadow-xl ${
              theme === "dark" 
                ? "bg-gray-800 text-white bg-opacity-90" 
                : "bg-white text-black bg-opacity-90"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <PartyPopper size={48} className="text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-lg mb-6">You've reached Level {newLevel - 1}!</p>
            
            {isMaxLevel && (
              <p className="text-amber-600 mb-4 font-medium">
                You've reached the maximum level! 🏆
              </p>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white py-3 px-8 rounded-full font-medium w-full hover:bg-green-600"
              onClick={() => onClose(isMaxLevel)} // Pass isMaxLevel to parent
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CongratsPopup;