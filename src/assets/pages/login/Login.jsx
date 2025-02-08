import React from "react";
import "./Login.css";
import Navbar from "../../components/navbar/Navbar";
import LoginBox from "../../components/loginBox/LoginBox";

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center align-middle mt-30">
        <img src="/logo.png" alt="logo" className="h-25 w-25 ml-175 p-4" />
        <LoginBox />
      </div>
    </>
  );
};

export default Login;
