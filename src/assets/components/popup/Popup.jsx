import { Dialog } from "@headlessui/react";
import { Settings } from "lucide-react";
import "./Popup.css";

export default function Popup({
  isSettingsOpen,
  setIsSettingsOpen,
  saveSettings,
  pomodoroTime,
  setPomodoroTime,
  customTime,
  setCustomTime,
}) {
  return (
    <div>
      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-3 right-3 text-gray-400 hover:text-black"
      >
        <Settings size={24} />
      </button>

      {/* Settings Popup */}
      <Dialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
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
              className="w-full p-2 text-black rounded-md"
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
              className="w-full p-2 text-black rounded-md"
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
