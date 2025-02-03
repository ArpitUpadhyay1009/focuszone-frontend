import { useState, useEffect } from "react";
import { Timer, Pause, RefreshCcw } from "lucide-react";

export default function TimerApp() {
  const [mode, setMode] = useState("pomodoro"); // Modes: pomodoro, countdown, stopwatch
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [customTime, setCustomTime] = useState(0);

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
    if (mode === "pomodoro") setTime(25 * 60);
    else if (mode === "countdown") setTime(customTime * 60);
    else setTime(0);
    setShowStart(true);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setShowStart(true);
    if (newMode === "pomodoro") setTime(25 * 60);
    else if (newMode === "countdown") setTime(customTime * 60);
    else setTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-120 h-contain text-center">
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

      {mode === "countdown" && (
        <div className="mb-4">
          <input
            type="number"
            className="border p-2 w-20 text-center rounded font-[Poppins]"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            placeholder="Minutes"
          />
        </div>
      )}

      <div className="text-8xl font-[Poppins] font-medium mb-4">
        {formatTime(time)}
      </div>

      <div className="space-x-4 flex justify-center">
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
      </div>
    </div>
  );
}
