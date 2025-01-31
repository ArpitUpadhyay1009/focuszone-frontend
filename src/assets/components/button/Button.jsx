import React from "react";
import "./Button.css";

export const Button = () => {
  return (
    <>
      <a href="/">
        <button className="bg-[#7500CA] text-white font-medium font-[Poppins] px-4 py-2 md:px-5 md:py-2 sm:px-4 sm:py-2 text-lg md:text-base sm:text-sm rounded-lg transition-all hover:scale-105 duration-300 cursor-pointer">
          Login/Register
        </button>
      </a>
    </>
  );
};

export default Button;
