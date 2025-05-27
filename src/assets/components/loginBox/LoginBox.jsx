import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import Confetti from "react-confetti";
import "./LoginBox.css";

const LoginBox = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
        // Request a persistent session (48 hours)
        rememberMe: true
      });

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        login(user, token);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 2000);
      } else {
        console.error("Login failed: No token or user received");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Invalid username or password! Please try again.");
        } else if (error.response.status === 403) {
          alert("Please verify your email first!");
          navigate("/verify-otp");
        } else {
          console.log(error)
          alert("Server error! Please try again later.");
          navigate("/server-error");
        }
      } else {
        console.error("An unexpected error occurred:", error);
        navigate("/server-error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="login-box p-6 rounded-lg shadow-lg w-110">
        <h2 className="text-4xl font-[Poppins] font-medium mb-4 text-left login-text">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block py-2 text-purple-700 font-[Poppins] font-medium">
              Welcome Back,
            </label>
            <p className="login-subtext py-2 font-[Poppins]">
              Please enter the details below to continue.
            </p>
            <input
              type="text"
              placeholder="Email or Username"
              className="login-input w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center eye-icon"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg cursor-pointer hover:bg-purple-800 transition shadow-[0px_-4px_10px_rgba(128,0,128,0.3)]"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between mt-4">
          <Link to="/register" className="text-purple-700 font-[Poppins] ml-2">
            Register
          </Link>
          <Link
            to="/forgot-password"
            className="text-purple-700 font-[Poppins] ml-2"
          >
            Forgot Password
          </Link>
        </div>
        {showSuccess && (
          <>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
            />
            <div className="popup-message">
              <div className="popup-content">
                <h3>Login Successful!</h3>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginBox;