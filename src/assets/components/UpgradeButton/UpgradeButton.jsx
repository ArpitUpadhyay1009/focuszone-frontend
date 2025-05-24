import { motion } from "framer-motion";
import { ArrowUp, Coins, Trophy } from "lucide-react";

const UpgradeButton = ({
  onClick,
  isUpgrading,
  coinsRequired,
  coinsAvailable,
  isMaxLevel = false,
  small = false,
}) => {
  const canUpgrade = coinsAvailable >= coinsRequired && !isMaxLevel;

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
        delay: 0.3,
      }}
      onClick={canUpgrade ? onClick : undefined}
      disabled={isUpgrading || !canUpgrade}
      className={`flex items-center justify-center rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow
        ${small ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"}
        ${
          isMaxLevel
            ? "bg-gray-400 text-white cursor-not-allowed"
            : canUpgrade
            ? "bg-orange-500 text-white"
            : "bg-gray-500 text-white"
        }`}
    >
      {isMaxLevel ? (
        <>
          <Trophy className={`${small ? "w-4 h-4 mr-1" : "w-5 h-5 mr-2"}`} />
          Max Level
        </>
      ) : (
        <>
          <motion.div
            className={small ? "mr-1.5" : "mr-2"}
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowUp className={small ? "w-4 h-4" : "w-5 h-5"} />
          </motion.div>
          Upgrade
          <div
            className={`flex items-center ml-2 ${
              canUpgrade
                ? "bg-orange-300 text-orange-600 border-1 border-orange-600"
                : "bg-gray-400 text-gray-500 border-1 border-gray-500"
            } bg-opacity-20 rounded-md ${small ? "px-1.5 py-0.5 text-sm" : "px-2 py-1"}`}
          >
            <Coins className={`${small ? "w-3.5 h-3.5 mr-1" : "w-4 h-4 mr-1"}`} />
            <span>{coinsRequired}</span>
          </div>
        </>
      )}
    </motion.button>
  );
};

export default UpgradeButton;
