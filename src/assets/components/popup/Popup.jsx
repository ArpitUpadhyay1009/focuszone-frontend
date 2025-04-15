import { Settings } from "lucide-react";
import "./Popup.css";
import { useEffect } from "react";

export default function Popup({
  isSettingsOpen,
  setIsSettingsOpen,
  saveSettings,
  pomodoroTime,
  setPomodoroTime,
  customTime,
  setCustomTime,
  setParentPopupState,
}) {
  // Emit event when popup state changes
  useEffect(() => {
    // Notify parent components about popup state
    const event = new CustomEvent('popup-state-change', { 
      detail: { isOpen: isSettingsOpen } 
    });
    window.dispatchEvent(event);
    
    // If setParentPopupState is provided, use it directly
    if (setParentPopupState) {
      setParentPopupState(isSettingsOpen);
    }
  }, [isSettingsOpen, setParentPopupState]);

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
      {isSettingsOpen && (
        <>
          {/* Completely remove the overlay div that was causing the black background */}
          
          {/* Popup content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#181818] text-white p-6 rounded-lg shadow-lg w-80">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
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
                  className="w-full p-2 text-black rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
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
                  className="w-full p-2 text-black rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  min="1"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveSettings}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-md mt-4 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
