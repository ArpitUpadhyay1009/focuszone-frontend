import React from "react";
import "./Navbar.css";
import Logo from "../logo/Logo.jsx";
import Button from "../button/Button.jsx";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle.jsx";

export const Navbar = () => {
  return (
    <>
      <div className="flex justify-between bg-transparent height-100vh width-100vw mt-[1em] mx-[1em]">
        <Logo />
        <div className="flex justify-between height-10vh width-10vw">
          <DarkModeToggle />
          <Button />
        </div>
      </div>
    </>
  );
};

export default Navbar;
