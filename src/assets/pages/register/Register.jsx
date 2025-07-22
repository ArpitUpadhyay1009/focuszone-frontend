import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/navbar/Navbar.jsx";
import "./Register.css";
import RegisterBox from "@components/registerBox/RegisterBox.jsx";
import Logo from "@components/logo/Logo.jsx";

import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Footer from "../../components/footer/Footer";

const Register = () => {
  // const [name, setName] = useState();
  // const [email, setEmail] = useState();
  // const [password, setPassword] = useState();
  // const navigate = useNavigate();

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   axios
  //     .post("/api/auth/register", { name, email, password })
  //     .then((result) => {
  //       console.log(result);
  //       if (result.data === "Already registered") {
  //         alert("E-mail already registered! Please Login to proceed.");
  //         navigate("/login");
  //       } else {
  //         alert("Registered successfully! Please Login to proceed.");
  //         navigate("/login");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-10 md:mt-20 h-screen">
        <img
          src="/logo.png"
          alt="logo"
          className="h-20 w-20 md:h-25 md:w-25 p-2 mb-4 object-contain" // Adjusted padding and added object-contain
        />
        <div className="w-full mb-60 max-w-xs md:max-w-md">
          <RegisterBox />
        </div>
      </div>
      <Footer/>
    </>
  );
};
export default Register;
