import React from "react";
import "./Login.css";
import Navbar from "@components/navbar/Navbar.jsx";
import LoginBox from "@components/loginBox/LoginBox.jsx";

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-10 md:mt-20 h-screen">
        <img src="/logo.png" alt="logo" className="h-20 w-20 md:h-25 md:w-25 p-4" />
        <div className="w-full mb-60 max-w-xs md:max-w-md">
          <LoginBox />
        </div>
      </div>
    </>
  );
};

export default Login;
