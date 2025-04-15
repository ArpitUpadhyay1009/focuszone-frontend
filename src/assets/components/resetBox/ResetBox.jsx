import { Link } from "react-router-dom";
import "./ResetBox.css";
import React from "react";
import { useTheme } from "../../context/ThemeContext.jsx";

const ResetBox = () => {
  const { theme } = useTheme();
  
  return (
    <>
      <div className="flex flex-col items-center justify-center bg-transparent">
        <div className="reset-box p-6 rounded-lg shadow-lg w-100">
          <h2 className="text-xl font-bold text-left font-[Poppins] mb-4 reset-text">
            Reset Password
          </h2>
          <form>
            <input
              type="password"
              placeholder="New Password"
              className="reset-input w-full p-2 border rounded-lg text-left font-[Poppins] focus:ring-2 focus:ring-[#7500CA]"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="reset-input w-full p-2 border rounded-lg text-left font-[Poppins] mt-2 focus:ring-2 focus:ring-[#7500CA]"
            />
            <Link to="/login">
              <button
                type="submit"
                className="mt-4 w-full bg-[#7500CA] text-white font-[Poppins] py-2 rounded-lg hover:bg-[#7500CA] transition"
              >
                Reset Password
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetBox;
