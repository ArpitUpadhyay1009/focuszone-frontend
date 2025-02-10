import Navbar from "../../components/navbar/Navbar";
import ResetBox from "../../components/resetBox/ResetBox";
import "./resetPassword.css";
import React from "react";

const ResetPassword = () => {
  return (
    <>
      <Navbar />
      <div className="mt-50">
        <ResetBox />
      </div>
    </>
  );
};

export default ResetPassword;
