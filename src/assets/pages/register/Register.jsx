import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar/Navbar.jsx";
import "./Register.css";
import RegisterBox from "@components/RegisterBox/RegisterBox.jsx";
import Logo from "@components/Logo/Logo.jsx";

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3001/register", { name, email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "Already registered") {
          alert("E-mail already registered! Please Login to proceed.");
          navigate("/login");
        } else {
          alert("Registered successfully! Please Login to proceed.");
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center align-middle mt-20">
        <img
          src="/logo.png"
          alt="logo"
          className="h-25 w-25 ml-[47%] p-4 mb-2"
        />
        <div className="ml-[1%]">
          <RegisterBox />
        </div>
      </div>
    </>
  );
};
export default Register;
