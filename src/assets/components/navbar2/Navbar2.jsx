import React from "react";
import "./Navbar2.css";
import Logo from "../Logo/Logo";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import LogoutButton from "../LogoutButton/LogoutButton";

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
