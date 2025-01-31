import React from "react";
import "./Logo.css";

export const Logo = () => {
  return (
    <>
      <a href="/">
        <img
          alt="logo"
          className="w-12 h-12 md:w-10 md:h-10 sm:w-9 sm:h-9 xs:w-8 xs:h-8 transition-transform duration-200 hover:scale-110"
        />
      </a>
    </>
  );
};

export default Logo;
