import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterBox.css";

const RegisterBox = () => {
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
      <div className="flex justify-center items-center bg-transparent">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-[Poppins] text-left font-semibold text-black mb-4">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-[Poppins] text-gray-700">
                Please enter the details below to continue.
              </label>
              <input
                type="text"
                placeholder="User Name"
                className="w-full px-3 py-2 font-[Poppins] border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg hover:bg-purple-800 transition"
            >
              Register
            </button>
          </form>
          <div className="flex justify-center items-center mt-4">
            <p className="text-gray-700">Already have an account?</p>
            <Link to="/login" className="text-purple-700 font-[Poppins] ml-2">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterBox;
