import React from "react";
import "./Navbar2.css";
import Logo from "../logo/Logo.jsx";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle.jsx";
import UserProfileMenu from "../userProfileMenu/UserProfileMenu.jsx";

export const Navbar2 = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Logo />
      </div>
      <div className="navbar-right">
        <DarkModeToggle />
        <UserProfileMenu />
      </div>
    </nav>
  );
};

export default Navbar2;
