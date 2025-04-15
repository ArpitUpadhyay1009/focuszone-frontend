import React from "react";
import "./Navbar.css";
import Logo from "../logo/Logo.jsx";
import Button from "../button/Button.jsx";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle.jsx";

export const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Logo />
      </div>
      <div className="navbar-right">
        <DarkModeToggle />
        <Button />
      </div>
    </nav>
  );
};

export default Navbar;
