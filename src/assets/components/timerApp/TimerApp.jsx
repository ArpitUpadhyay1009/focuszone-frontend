import { useState, useEffect } from "react";
import { Timer, Pause, RefreshCcw, Settings, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useTheme } from "../../context/ThemeContext";
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
                setCoins((prevCoins) => prevCoins + 0.5);
                setTime(breakTime);
              } else {
                setIsRunning(false);
                setCoins((prevCoins) => prevCoins + 0.5);
                return 0;
              }
            } else {
              setIsBreak(false);
              setCurrentCycle((prev) => prev + 1);
              setTime(pomodoroTime);
            }
            return prevTime;
          }

          // Award coins after the minute has elapsed
          if (mode === "pomodoro" && !isBreak && (prevTime - 1) % 60 === 0) {
            setCoins((prevCoins) => prevCoins + 0.5);
          }

          return mode === "stopwatch" ? prevTime + 1 : prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, mode, isBreak, cycles, currentCycle, pomodoroTime, breakTime]);

  // Function to save coins to the database
  const saveCoinsToDatabase = async (coins) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/save-coin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coins }),
      });
      if (!response.ok) {
        throw new Error("Failed to save coins");
      }
      const data = await response.json();
      console.log("Coins saved:", data);
    } catch (error) {
      console.error("Error saving coins:", error);
    }
  };

  // Save coins when the component unmounts or when the session ends
  useEffect(() => {
    return () => {
      if (coins > 0) {
        saveCoinsToDatabase(coins);
      }
    };
  }, [coins]);

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
    <div
      className={`p-6 rounded-lg shadow-lg w-120 h-contain text-center relative transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between border border-[#7500CA] rounded-full p-0 mb-4">
        <button
          className={`px-4 py-2 rounded-full transition-colors duration-300 ${
            isBreak
              ? "bg-gray-300"
              : mode === "pomodoro"
              ? theme === "dark"
                ? "bg-purple-500 text-white"
                : "bg-orange-300 text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setMode("pomodoro");
            setTime(pomodoroTime);
          }}
        >
          {isBreak ? "Break" : "Pomodoro"}
        </button>
        <button
          className={`px-4 py-2 rounded-full transition-colors duration-300 ${
            mode === "countdown"
              ? theme === "dark"
                ? "bg-purple-500 text-white"
                : "bg-orange-300 text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setMode("countdown");
            setTime(countdownTime);
          }}
        >
          Countdown
        </button>
        <button
          className={`px-4 py-2 rounded-full transition-colors duration-300 ${
            mode === "stopwatch"
              ? theme === "dark"
                ? "bg-purple-500 text-white"
                : "bg-orange-300 text-black"
              : theme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setMode("stopwatch");
            setTime(0);
          }}
        >
          Stopwatch
        </button>
      </div>
      <div
        className={`text-8xl font-medium mb-4 transition-colors duration-300 ${
          isBreak
            ? "text-gray-500"
            : theme === "dark"
            ? "text-white"
            : "text-black"
        }`}
      >
        {formatTime(time)}
      </div>
      <div className="flex justify-center items-center space-x-4">
        {showStart ? (
          <button
            onClick={startTimer}
            className="bg-[#7500CA] text-white px-36 py-2 rounded flex items-center justify-center transition-colors duration-300"
          >
            <Timer size={20} />
            <span>Start</span>
          </button>
        ) : (
          <>
            <button
              onClick={pauseTimer}
              className="bg-[#7500CA] text-white px-8 py-2 rounded flex items-center justify-center transition-colors duration-300"
            >
              <Pause size={20} />
              <span>Pause</span>
            </button>
            <button
              onClick={resetTimer}
              className="bg-[#7500CA] text-white px-8 py-2 rounded flex items-center justify-center transition-colors duration-300"
            >
              <RefreshCcw size={20} />
              <span>Reset</span>
            </button>
          </>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSettingsOpen(true)}
          className="text-[#fff] hover:text-gray-200 ml-4 px-2 py-2 rounded bg-[#7500CA] transition-colors duration-300"
        >
          <Settings size={24} />
        </motion.button>
      </div>
      {/* Display Coins */}
      <div className="mt-4 text-lg font-semibold transition-colors duration-300">
        Coins Earned: {coins}
      </div>
      <AnimatePresence>
        {isSettingsOpen && (
          <Dialog
            open={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              className="fixed inset-0 bg-transparent bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)} // ✅ Click outside closes modal
            />
            <div
              className="fixed inset-0 bg-transparent bg-opacity-50"
              onClick={() => setIsSettingsOpen(false)}
            ></div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`p-6 rounded-lg shadow-lg w-80 relative transition-colors duration-300 ${
                theme === "dark" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <label className="block mb-2">Pomodoro Time (minutes)</label>
              <input
                type="number"
                value={pomodoroTime / 60}
                onChange={(e) => setPomodoroTime(Number(e.target.value) * 60)}
                className="w-full p-2 border rounded-md mb-4 transition-colors duration-300"
                min="1"
              />
              <label className="block mb-2">Countdown Time (minutes)</label>
              <input
                type="number"
                value={countdownTime / 60}
                onChange={(e) => setCountdownTime(Number(e.target.value) * 60)}
                className="w-full p-2 border rounded-md mb-4 transition-colors duration-300"
                min="1"
              />
              <label className="block mb-2">Break Time (minutes)</label>
              <input
                type="number"
                value={breakTime / 60}
                onChange={(e) => setBreakTime(Number(e.target.value) * 60)}
                className="w-full p-2 border rounded-md mb-4 transition-colors duration-300"
                min="1"
              />
              <label className="block mb-2">Number of Cycles</label>
              <input
                type="number"
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
                className="w-full p-2 border rounded-md mb-4 transition-colors duration-300"
                min="1"
              />
              <button
                onClick={saveSettings}
                className="bg-purple-600 text-white w-full py-2 rounded-md transition-colors duration-300"
              >
                Save
              </button>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
