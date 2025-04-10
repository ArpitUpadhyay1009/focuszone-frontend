import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

const CongratsPopup = ({ isOpen, onClose, newLevel }) => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-center">
          <PartyPopper size={48} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
        <p className="text-lg mb-6">You've reached Level {newLevel  - 1}!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 text-white py-3 px-8 rounded-full font-medium w-full hover:bg-green-600"
          onClick={onClose}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CongratsPopup;