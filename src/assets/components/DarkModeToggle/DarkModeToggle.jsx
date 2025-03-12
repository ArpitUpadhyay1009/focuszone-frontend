import { SunDim, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext"; // Import theme context
import "./DarkModeToggle.css";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-3 mr-[1.5em]">
      {/* Sun icon */}
      <SunDim className="w-6 h-6 text-gray-500" />

      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`relative flex items-center w-11 h-6 md:w-10 md:h-5 sm:w-9 sm:h-4 rounded-full p-1 transition-all duration-300 ${
          isDark ? "bg-[#7500CA]" : "bg-gray-200"
        }`}
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

      {/* Moon icon */}
      <Moon className="w-6 h-6 text-gray-500" />
    </div>
  );
}
