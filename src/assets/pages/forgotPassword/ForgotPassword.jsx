import React from "react";
import Navbar from "@components/Navbar/Navbar";
import ForgotBox from "@components/ForgotBox/ForgotBox";
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
