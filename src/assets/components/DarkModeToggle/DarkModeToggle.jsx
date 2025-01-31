import { useState, useEffect } from "react";
import { SunDim, Moon } from "lucide-react";
import "./DarkModeToggle.css";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="flex items-center gap-3 mr-[1.5em]">
      {/* Sun icon on the left */}
      <SunDim className="w-6 h-6 text-gray-500" />

      {/* Toggle Switch */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="relative flex items-center w-11 h-6 md:w-10 md:h-5 sm:w-9 sm:h-4 bg-gray-200 rounded-full p-1 transition-all duration-300"
      >
        {/* Moving Circle */}
        <div
          className={`absolute w-4 h-4 md:w-3.5 md:h-3.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-md transform transition-all duration-300 ${
            isDark
              ? "translate-x-[20px] md:translate-x-[18px] sm:translate-x-[14px]"
              : "translate-x-0"
          }`}
        ></div>
      </button>

      {/* Moon icon on the right */}
      <Moon className="w-6 h-6 text-gray-600" />
    </div>
  );
}
