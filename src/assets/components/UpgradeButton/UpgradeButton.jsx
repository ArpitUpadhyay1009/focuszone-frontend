import { motion } from "framer-motion";
import { ArrowUp, Coins } from "lucide-react";

const UpgradeButton = ({ onClick, isUpgrading, coinsRequired, coinsAvailable }) => {
  const canUpgrade = coinsAvailable >= coinsRequired; // ✅ Ensure this evaluates correctly

  return (
    <motion.button
      whileHover={{ scale: canUpgrade ? 1.03 : 1 }}
      whileTap={{ scale: canUpgrade ? 0.97 : 1 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
        delay: 0.3
      }}
      onClick={canUpgrade ? onClick : undefined} // ✅ Prevents clicking if not enough coins
      disabled={isUpgrading || !canUpgrade} // ✅ Ensures the button is enabled when upgrade is possible
      className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow ${
        canUpgrade 
          ? "bg-upgrade-orange text-white hover:bg-orange-500"  // ✅ Enable hover effect only when possible
          : "bg-gray-300 text-gray-600 cursor-not-allowed"
      }`}
    >
      <motion.div
        className="mr-2"
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.div>
      Upgrade
      <div className="flex items-center ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-md">
        <Coins className="w-4 h-4 mr-1" />
        <span>{coinsRequired}</span>
      </div>
    </motion.button>
  );
};

export default UpgradeButton;
