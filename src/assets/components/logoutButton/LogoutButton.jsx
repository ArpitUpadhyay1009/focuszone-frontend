import "./LogoutButton.css";
import React from "react";
import { Link } from "react-router-dom";
const LogoutButton = () => {
  return (
    <>
      <Link to="/login">
        <button className="bg-[#7500CA] text-white font-medium font-[Poppins] px-4 py-2 md:px-5 md:py-2 sm:px-4 sm:py-2 text-lg md:text-base sm:text-sm rounded-lg transition-all hover:scale-105 duration-300 cursor-pointer">
          Logout
        </button>
      </Link>
    </>
  );
};

export default LogoutButton;
