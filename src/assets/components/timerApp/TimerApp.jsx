import { useState, useEffect } from "react";
import { Timer, Pause, RefreshCcw, Settings, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import "./TimerApp.css";

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

  const notificationSound = new Audio("/notification.mp3");

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1 && mode !== "stopwatch") {
            clearInterval(timer);
            notificationSound.play();
            if (mode === "pomodoro" && !isBreak) {
              if (currentCycle < cycles) {
                setIsBreak(true);
                setTime(breakTime);
              } else {
                setIsRunning(false);
              }
            } else {
              setIsBreak(false);
              setCurrentCycle((prev) => prev + 1);
              setTime(pomodoroTime);
            }
            return prevTime;
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
    <div className="bg-white p-6 rounded-lg shadow-lg w-120 h-contain text-center relative">
      <div className="flex justify-between border border-[#7500CA] rounded-full p-0 mb-4">
        <button
          className={`px-4 py-2 rounded-full ${
            isBreak
              ? "bg-gray-300"
              : mode === "pomodoro"
              ? "bg-orange-300"
              : "bg-white"
          }`}
          onClick={() => {
            setMode("pomodoro");
            setTime(pomodoroTime);
          }}
        >
          {isBreak ? "Break" : "Pomodoro"}
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            mode === "countdown" ? "bg-orange-300" : "bg-white"
          }`}
          onClick={() => {
            setMode("countdown");
            setTime(countdownTime);
          }}
        >
          Countdown
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            mode === "stopwatch" ? "bg-orange-300" : "bg-white"
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
        className={`text-8xl font-medium mb-4 ${
          isBreak ? "text-gray-500" : "text-black"
        }`}
      >
        {formatTime(time)}
      </div>

      <div className="flex justify-center items-center space-x-4">
        {showStart ? (
          <button
            onClick={startTimer}
            className="bg-[#7500CA] text-white px-36 py-2 rounded flex items-center justify-center"
          >
            <Timer size={20} />
            <span>Start</span>
          </button>
        ) : (
          <>
            <button
              onClick={pauseTimer}
              className="bg-[#7500CA] text-white px-8 py-2 rounded flex items-center justify-center"
            >
              <Pause size={20} />
              <span>Pause</span>
            </button>
            <button
              onClick={resetTimer}
              className="bg-[#7500CA] text-white px-8 py-2 rounded flex items-center justify-center"
            >
              <RefreshCcw size={20} />
              <span>Reset</span>
            </button>
          </>
        )}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-[#fff] hover:text-gray-200 ml-4 px-2 py-1 rounded bg-[#7500CA]"
        >
          <Settings size={24} />
        </button>
      </div>
      <Dialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSettingsOpen(false)}
        ></div>
        <div className="bg-white bg-dark p-6 rounded-lg shadow-lg w-80 relative">
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
            className="w-full p-2 border rounded-md mb-4"
            min="1"
          />
          <label className="block mb-2">Countdown Time (minutes)</label>
          <input
            type="number"
            value={countdownTime / 60}
            onChange={(e) => setCountdownTime(Number(e.target.value) * 60)}
            className="w-full p-2 border rounded-md mb-4"
            min="1"
          />
          <label className="block mb-2">Break Time (minutes)</label>
          <input
            type="number"
            value={breakTime / 60}
            onChange={(e) => setBreakTime(Number(e.target.value) * 60)}
            className="w-full p-2 border rounded-md mb-4"
            min="1"
          />
          <label className="block mb-2">Number of Cycles</label>
          <input
            type="number"
            value={cycles}
            onChange={(e) => setCycles(Number(e.target.value))}
            className="w-full p-2 border rounded-md mb-4"
            min="1"
          />
          <button
            onClick={saveSettings}
            className="bg-purple-600 text-white w-full py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </Dialog>
    </div>
  );
}
