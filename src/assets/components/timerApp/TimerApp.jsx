import { useState, useEffect } from "react";
import { Timer, Pause, RefreshCcw, Settings } from "lucide-react";
import { Dialog } from "@headlessui/react";

export default function TimerApp() {
  const [mode, setMode] = useState("pomodoro"); // Modes: pomodoro, countdown, stopwatch
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [customTime, setCustomTime] = useState(5); // Default countdown time in minutes
  const [pomodoroTime, setPomodoroTime] = useState(25); // Default Pomodoro time in minutes
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

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
    if (mode === "pomodoro") setTime(pomodoroTime * 60);
    else if (mode === "countdown") setTime(customTime * 60);
    else setTime(0);
    setShowStart(true);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setShowStart(true);
    if (newMode === "pomodoro") setTime(pomodoroTime * 60);
    else if (newMode === "countdown") setTime(customTime * 60);
    else setTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const saveSettings = () => {
    setIsSettingsOpen(false);
    if (mode === "pomodoro") setTime(pomodoroTime * 60);
    if (mode === "countdown") setTime(customTime * 60);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-120 h-contain text-center relative">
      {/* Mode Switcher */}
      <div className="flex justify-between border border-[#7500CA] rounded-full p-0 mb-4">
        <button
          className={`px-4 py-2 rounded-full ${
            mode === "pomodoro"
              ? "bg-orange-300 font-[Poppins]"
              : "bg-white font-[Poppins]"
          }`}
          onClick={() => handleModeChange("pomodoro")}
        >
          Pomodoro
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            mode === "countdown"
              ? "bg-orange-300 font-[Poppins]"
              : "bg-white font-[Poppins]"
          }`}
          onClick={() => handleModeChange("countdown")}
        >
          Countdown
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            mode === "stopwatch"
              ? "bg-orange-300 font-[Poppins]"
              : "bg-white font-[Poppins]"
          }`}
          onClick={() => handleModeChange("stopwatch")}
        >
          Stopwatch
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-8xl font-[Poppins] font-medium mb-4">
        {formatTime(time)}
      </div>

      {/* Start/Pause/Reset Buttons with Settings Icon */}
      <div className="flex justify-center items-center space-x-4">
        {showStart ? (
          <button
            onClick={startTimer}
            className="bg-[#7500CA] text-white font-[Poppins] px-36 py-2 rounded flex items-center justify-center space-x-2"
          >
            <Timer size={20} />
            <span>Start</span>
          </button>
        ) : (
          <>
            <button
              onClick={pauseTimer}
              className="bg-[#7500CA] text-white font-[Poppins] px-8 py-2 rounded flex items-center justify-center space-x-2"
            >
              <Pause size={20} />
              <span>Pause</span>
            </button>
            <button
              onClick={resetTimer}
              className="bg-[#7500CA] text-white font-[Poppins] px-8 py-2 rounded flex items-center justify-center space-x-2"
            >
              <RefreshCcw size={20} />
              <span>Reset</span>
            </button>
          </>
        )}

        {/* Settings Button positioned next to the Start Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-[#fff] hover:text-gray-200 ml-4 px-2 py-1 rounded bg-[#7500CA]"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Settings Popup */}
      <Dialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-400"
          onClick={() => setIsSettingsOpen(false)}
        ></div>

        <div className="bg-[#181818] text-white p-6 rounded-lg shadow-lg w-80 relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={() => setIsSettingsOpen(false)}
          >
            ✖
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold mb-4">Settings</h2>

          {/* Pomodoro Time Input */}
          <div className="mb-4">
            <label className="block mb-2">Pomodoro Time (minutes)</label>
            <input
              type="number"
              value={pomodoroTime}
              onChange={(e) => setPomodoroTime(Number(e.target.value))}
              className="w-full p-2 text-white rounded-md"
              min="1"
            />
          </div>

          {/* Countdown Time Input */}
          <div className="mb-4">
            <label className="block mb-2">Countdown Time (minutes)</label>
            <input
              type="number"
              value={customTime}
              onChange={(e) => setCustomTime(Number(e.target.value))}
              className="w-full p-2 text-white rounded-md"
              min="1"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="bg-purple-600 text-white w-full py-2 rounded-md mt-4"
          >
            Save
          </button>
        </div>
      </Dialog>
    </div>
  );
}
