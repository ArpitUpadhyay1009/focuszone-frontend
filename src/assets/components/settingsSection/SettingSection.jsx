import "./SettingSection.css";
import React, { useState } from "react";

const SettingsSection = () => {
  const [darkMode, setDarkMode] = useState(true);

  const handleReset = () => {
    alert("⚠️ This would trigger a data reset logic in production.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="px-4 py-1 rounded-full bg-gray-800 text-white"
          >
            {darkMode ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reset All Stats (Mock)
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;
