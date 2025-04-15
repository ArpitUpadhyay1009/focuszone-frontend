import React from "react";
import Navbar from "@components/navbar/Navbar.jsx";
import ForgotBox from "@components/forgotBox/ForgotBox.jsx";
import "./ForgotPassword.css";
import AnimatedBackground from "@components/animatedBackground/AnimatedBackground.jsx";

const ForgotPassword = () => {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <div className="mt-50">
        <ForgotBox />
      </div>
    </>
  );
};

export default ForgotPassword;
