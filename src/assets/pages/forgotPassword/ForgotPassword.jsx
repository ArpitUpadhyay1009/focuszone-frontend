import React from "react";
import Navbar from "@components/navbar/Navbar.jsx";
import ForgotBox from "@components/forgotBox/ForgotBox.jsx";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  return (
    <>
      <Navbar />
      <div className="mt-50">
        <ForgotBox />
      </div>
    </>
  );
};

export default ForgotPassword;
