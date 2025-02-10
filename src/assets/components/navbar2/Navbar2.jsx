import React from "react";
import "./Navbar2.css";
import Logo from "../logo/Logo";
import DarkModeToggle from "../darkModeToggle/DarkModeToggle";
import LogoutButton from "../logoutButton/LogoutButton";

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
