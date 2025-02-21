import React from "react";
import "./Login.css";
import Navbar from "../../components/navbar/Navbar";
import LoginBox from "../../components/loginBox/LoginBox";

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center align-middle mt-20">
        <img src="/logo.png" alt="logo" className="h-25 w-25 ml-[47%] p-4" />
        <div className="ml-[1%]">
          <LoginBox />
        </div>
      </div>
    </>
  );
};

export default Login;
