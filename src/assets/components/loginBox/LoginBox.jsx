import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./LoginBox.css";

const LoginBox = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
      });

      alert("Login successful!");
      if (response.data.token) {
        login(response.data.user, response.data.token);
        navigate("/home"); // ✅ Redirect after login
      } else {
        console.error("Login failed: No token received");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Invalid username or password! Please try again.");
        } else if (error.response.status === 403) {
          alert("Please verify your email first!");
          navigate("/verify-otp"); // Navigate to OTP verification page
        } else {
          alert("Server error! Please try again later.");
          navigate("/server-error"); // Navigate to server error page
        }
      } else {
        console.error("An unexpected error occurred:", error);
        navigate("/server-error"); // Fallback for unexpected errors
      }
    }
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
              <label className="block py-2 text-purple-700 font-[Poppins] font-medium">
                Welcome Back,
              </label>
              <p className="text-gray-700 py-2 font-[Poppins]">
                Please enter the details below to continue.
              </p>
              <input
                type="name"
                placeholder="Email or Username"
                className="w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
            </div>
            <div className="relative w- full mb-4">
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
              {/* <a
                href="/forgot"
                className="text-purple-700 font-[Poppins] font-semibold block mt-2"
              >
                Forgot password
              </a> */}
              {/* <Link
                to="/forgot"
                className="text-purple-700 font-[Poppins] font-semibold block mt-2"
              >
                Forgot Password?
              </Link> */}
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg cursor-pointer hover:bg-purple-800 transition shadow-[0px_-4px_10px_rgba(128,0,128,0.3)]"
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
