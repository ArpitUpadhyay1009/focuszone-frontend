import { useState, useEffect } from "react";
import axios from "axios";
import { Timer, Pause, RefreshCcw, Settings, X, Coins } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./TimerApp.css";
import { motion, AnimatePresence } from "framer-motion";

export default function TimerApp() {
  const [mode, setMode] = useState("pomodoro");
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [cycles, setCycles] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [countdownTime, setCountdownTime] = useState(5 * 60);
  const [coins, setCoins] = useState(0); // New state for coins

  const notificationSound = new Audio("/notification.mp3");

  const { theme } = useTheme();

  // Function to save coins to the database
  const saveCoinsToDatabase = async (earnedCoins) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might not be logged in");
        return;
      }
      
      const response = await axios.post(
        "http://localhost:3001/api/auth/save-coin",
        { coins: earnedCoins },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Coins saved:", response.data);
      
      // Dispatch a custom event to notify other components that coins have been updated
      window.dispatchEvent(new Event("coinUpdate"));
      
      return response.data;
    } catch (error) {
      console.error("Error saving coins:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1 && mode !== "stopwatch") {
            clearInterval(timer);
            notificationSound.play();

            if (mode === "countdown") {
              setIsRunning(false);
              return 0;
            }

            if (mode === "pomodoro" && !isBreak) {
              if (currentCycle + 1 < cycles) {
                setIsBreak(true);
                // Immediately save coins when earned at the end of a pomodoro session
                saveCoinsToDatabase(1);
                setCoins((prevCoins) => prevCoins + 1);
                setTime(breakTime);
              } else {
                setIsRunning(false);
                // Immediately save coins when earned at the end of all cycles
                saveCoinsToDatabase(1);
                setCoins((prevCoins) => prevCoins + 1);
                
                // Auto reset after a short delay when all cycles are completed
                setTimeout(() => {
                  resetTimer();
                  setCoins(0); // Explicitly reset coins display
                }, 2000);
                
                return 0;
              }
            } else {
              setIsBreak(false);
              setCurrentCycle((prev) => prev + 1);
              setTime(pomodoroTime);
            }
            return prevTime;
          }

          // Award and save coins after each minute
          if (mode === "pomodoro" && !isBreak && (prevTime - 1) % 60 === 0 && prevTime > 1) {
            // Immediately save coins when earned each minute
            saveCoinsToDatabase(1);
            setCoins((prevCoins) => prevCoins + 1);
          }

          return mode === "stopwatch" ? prevTime + 1 : prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, mode, isBreak, cycles, currentCycle, pomodoroTime, breakTime]);

  const startTimer = () => {
    setIsRunning(true);
    setShowStart(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setShowStart(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setCurrentCycle(0);
    if (mode === "pomodoro") setTime(pomodoroTime);
    if (mode === "countdown") setTime(countdownTime);
    if (mode === "stopwatch") setTime(0);
    setShowStart(true);
    setCoins(0); // Reset coins when resetting the timer
    
    // Dispatch the coinUpdate event when resetting
    window.dispatchEvent(new Event("coinUpdate"));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const saveSettings = () => {
    setIsSettingsOpen(false);
    if (mode === "pomodoro") setTime(pomodoroTime);
    if (mode === "countdown") setTime(countdownTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-8 rounded-2xl shadow-lg max-w-md mx-auto text-center relative transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Mode selector with improved styling */}
      <motion.div 
        className="flex justify-between border border-[#7500CA] rounded-full p-1 mb-6"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className={`px-6 py-3 rounded-full transition-all duration-300 ${
            isBreak
              ? "bg-gray-300 text-gray-700"
              : mode === "pomodoro"
              ? "bg-[#FFE3A6] text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setMode("pomodoro");
            setTime(pomodoroTime);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isBreak ? "Break" : "Pomodoro"}
        </motion.button>
        <motion.button
          className={`px-6 py-3 rounded-full transition-all duration-300 ${
            mode === "countdown"
              ? "bg-[#FFE3A6] text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setMode("countdown");
            setTime(countdownTime);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Countdown
        </motion.button>
        <motion.button
          className={`px-6 py-3 rounded-full transition-all duration-300 ${
            mode === "stopwatch"
              ? "bg-[#FFE3A6] text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setMode("stopwatch");
            setTime(0);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Timer
        </motion.button>
      </motion.div>

      {/* Timer display with animation */}
      <motion.div
        key={`${mode}-${isBreak}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`text-8xl font-bold mb-8 transition-colors duration-300 ${
          isBreak
            ? "text-gray-500"
            : theme === "dark"
            ? "text-white"
            : "text-black"
        }`}
      >
        {formatTime(time)}
      </motion.div>

      {/* Control buttons with improved styling */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <AnimatePresence mode="wait">
          {showStart ? (
            <motion.button
              key="start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={startTimer}
              className="bg-[#7500CA] text-white px-12 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Timer size={24} />
              <span className="text-lg font-medium">Start</span>
            </motion.button>
          ) : (
            <motion.div 
              key="controls"
              className="flex space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                onClick={pauseTimer}
                className="bg-[#7500CA] text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Pause size={24} />
                <span className="text-lg font-medium">Pause</span>
              </motion.button>
              <motion.button
                onClick={resetTimer}
                className="bg-[#7500CA] text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCcw size={24} />
                <span className="text-lg font-medium">Reset</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSettingsOpen(true)}
          className="text-[#fff] hover:text-gray-200 ml-4 p-3 rounded-full bg-[#7500CA] shadow-lg transition-all duration-300"
        >
          <Settings size={24} />
        </motion.button>
      </div>

      {/* Coins display with animation */}
      <motion.div 
        className="mt-4 text-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Coins size={24} className="text-yellow-500" />
        <motion.span
          key={coins}
          initial={{ scale: 1.5, color: "#FFD700" }}
          animate={{ scale: 1, color: theme === "dark" ? "#FFFFFF" : "#000000" }}
          transition={{ duration: 0.5 }}
        >
          {coins} Coins Earned
        </motion.span>
      </motion.div>

      {/* Settings dialog with improved styling */}
      <AnimatePresence>
        {isSettingsOpen && (
          <Dialog
            open={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`p-8 rounded-2xl shadow-2xl w-96 relative transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </motion.button>
              <h2 className="text-2xl font-bold mb-6">Timer Settings</h2>
              
              {/* Settings inputs with improved styling */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Pomodoro Time (minutes)</label>
                  <input
                    type="number"
                    value={pomodoroTime / 60}
                    onChange={(e) => setPomodoroTime(Number(e.target.value) * 60)}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Break Time (minutes)</label>
                  <input
                    type="number"
                    value={breakTime / 60}
                    onChange={(e) => setBreakTime(Number(e.target.value) * 60)}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Countdown Time (minutes)</label>
                  <input
                    type="number"
                    value={countdownTime / 60}
                    onChange={(e) => setCountdownTime(Number(e.target.value) * 60)}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Number of Cycles</label>
                  <input
                    type="number"
                    value={cycles}
                    onChange={(e) => setCycles(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-colors duration-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveSettings}
                className="bg-[#7500CA] text-white w-full py-3 rounded-lg mt-6 font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Settings
              </motion.button>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
