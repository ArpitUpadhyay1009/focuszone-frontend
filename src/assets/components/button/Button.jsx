import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";

export const Button = () => {
  return (
    <>
      <Link to="/register">
        <button className="bg-[#7500CA] text-white font-medium font-[Poppins] px-3 py-1.5 md:px-4 md:py-2 sm:px-3 sm:py-1.5 text-base md:text-sm sm:text-xs rounded-lg transition-all hover:scale-105 duration-300 cursor-pointer">
          Login/Register
        </button>
      </Link>
    </>
  );
};

export default Button;
