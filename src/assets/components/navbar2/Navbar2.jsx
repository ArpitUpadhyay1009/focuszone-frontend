import React from "react";
import "./Navbar2.css";
import Logo from "../Logo/Logo.jsx";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle.jsx";
import LogoutButton from "../LogoutButton/LogoutButton.jsx";

export const Navbar2 = () => {
  return (
    <>
      <div className="flex justify-between bg-transparent height-100vh width-100vw mt-[1em] mx-[1em]">
        <Logo />
        <div className="flex justify-between height-10vh width-10vw">
          <DarkModeToggle />
          <LogoutButton />
        </div>
      </div>
    </>
  );
};

export default Navbar2;
