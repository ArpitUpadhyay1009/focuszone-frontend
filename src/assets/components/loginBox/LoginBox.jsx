import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginBox.css";

const LoginBox = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          console.log("Login Success");
          alert("Login successful!");
          navigate("/");
        } else {
          alert("Incorrect password! Please try again.");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-110">
          <h2 className="text-4xl font-[Poppins] font-medium text-black mb-4 text-left">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-purple-700 font-[Poppins] font-semibold">
                Welcome Back,
              </label>
              <p className="text-gray-700 font-[Poppins]">
                Please enter the details below to continue.
              </p>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-3 py-2 border font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-3 py-2 border font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Link
                to="/forgot"
                className="text-purple-700 font-[Poppins] font-semibold block mt-2"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg hover:bg-purple-800 transition"
            >
              Login
            </button>
          </form>
          <div className="flex justify-center items-center mt-4">
            <p className="text-gray-700 font-[Poppins]">
              Don't have an account?
            </p>
            <Link
              to="/register"
              className="text-purple-700 font-[Poppins] ml-2"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginBox;
