import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

const LevelFake = () => {
  const { theme } = useTheme();
  return (
    <div
      className="relative w-full flex justify-center items-center"
      style={{ minHeight: 200 }}
    >
      {/* Blurred overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl shadow-lg backdrop-blur-lg bg-opacity-70 ${
          theme === "dark" ? "bg-black/70 text-white" : "bg-white/70 text-black"
        }`}
        style={{
          borderRadius: "0.75rem",
          border: theme === "dark" ? "1.5px solid #333" : "1.5px solid #e5e7eb",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <Lock size={48} className="mb-4" />
        <span className="text-xl font-semibold tracking-wide">
          Login to unlock
        </span>
      </motion.div>
      {/* Fake LevelUpgradeSystem box for background look */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`md:w-110 sm:w-100 p-6 rounded-xl shadow-lg mb-3 ${
          theme === "dark"
            ? "bg-black text-white bg-opacity-95"
            : "bg-white text-black bg-opacity-95"
        }`}
        style={{
          filter: "blur(1px)",
          pointerEvents: "none",
          userSelect: "none",
          border: theme === "dark" ? "1.5px solid #444" : "1.5px solid #e5e7eb",
          boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.12)",
        }}
      >
        <h3 className="text-lg font-semibold mb-2 opacity-60">
          Level Progress
        </h3>
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded-full mb-4 opacity-60" />
        <div className="flex justify-between items-center mt-3 opacity-60">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium">Your coins:</span>
            <div className="flex items-center px-2 py-0.5 rounded-md border bg-amber-50 border-amber-200 dark:bg-gray-800 dark:border-gray-700">
              <span className="w-3 h-3 mr-1 bg-yellow-400 rounded-full inline-block" />
              <span className="font-semibold text-amber-600 dark:text-yellow-400">
                0
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-xl bg-gray-400 text-white cursor-not-allowed font-medium flex items-center">
              <span className="mr-2">Upgrade</span>
              <span className="w-4 h-4 bg-gray-500 rounded-full inline-block" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelFake;
