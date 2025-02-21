import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./RegisterBox.css";

const RegisterBox = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      alert("Registered successfully! Please verify your email.");
      navigate("/verify-otp"); // Navigate to OTP verification page
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Email or Username already in use!");
        } else {
          alert(`error: ${error}`);
          navigate("/server-error"); // Navigate to server error page
        }
      } else {
        alert(`error: ${error}`);
        console.error("An unexpected error occurred:", error);
        navigate("/server-error"); // Fallback for unexpected errors
      }
    }
  };
  return (
    <>
      <div className="flex justify-center items-center bg-transparent">
        <div className="bg-white p-6 rounded-lg shadow-lg w-110">
          <h2 className="text-4xl font-[Poppins] text-left font-medium text-black mb-4">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-[Poppins] text-gray-700 py-4">
                Please enter the details below to continue.
              </label>
              <input
                type="text"
                placeholder="User Name"
                className="w-full px-3 py-2 font-[Poppins] bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 bg-gray-200 border-none font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Password"
                className="w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10" // Right padding added
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {/* Eye Icon Inside the Input Box */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg cursor-pointer hover:bg-purple-800 transition shadow-[0px_-4px_10px_rgba(128,0,128,0.3)]"
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
