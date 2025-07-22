import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginBox.css";

// Custom Error Popup Component
const ErrorPopup = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="fixed inset-0 flex items-center justify-center z-50 px-4"
  >
    <div 
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-6 max-w-sm w-full shadow-xl z-10 border border-white/20">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X size={20} />
      </button>
      <div className="text-red-500 font-medium">Error</div>
      <p className="mt-2 text-gray-700 dark:text-gray-300">{message}</p>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  </motion.div>
);

const LoginBox = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setShowProgress(true);
    setProgress(0);

    try {
      // Simulate progress animation (1 second duration)
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newProgress;
        });
      }, 100); // 100ms * 9 steps = 900ms (close to 1s)

      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
        rememberMe: true,
      });

      const { token, user } = response.data;

      clearInterval(interval);
      setProgress(100);

      if (token && user) {
        localStorage.setItem("token", token);
        login(user, token);
        setShowSuccess(true);
        window.sessionStorage.removeItem("otpSent");

        setTimeout(() => {
          setShowProgress(false);
          setIsLoading(false);
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 500);
      } else {
        console.error("Login failed: No token or user received");
      }
    } catch (error) {
      setShowProgress(false);
      setIsLoading(false);
      if (error.response) {
        if (error.response.status === 400) {
          setError("Invalid username or password! Please try again.");
        } else if (error.response.status === 403) {
          setError("Please verify your email first!");
          window.sessionStorage.setItem("otpSent", "1");
          setTimeout(() => navigate("/verify-otp"), 2000);
        } else {
          console.log(error);
          setError("Server error! Please try again later.");
          setTimeout(() => navigate("/server-error"), 2000);
        }
      } else {
        console.error("An unexpected error occurred:", error);
        setError("An unexpected error occurred. Please try again later.");
        setTimeout(() => navigate("/server-error"), 2000);
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <AnimatePresence>
        {error && (
          <ErrorPopup 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4 text-center">Logging in</h3>

              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>

              <p className="text-center text-gray-600">
                {progress < 100
                  ? "Authenticating..."
                  : "Success! Redirecting..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              disabled={isLoading}
            />
          </div>
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center eye-icon"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg cursor-pointer transition shadow-[0px_-4px_10px_rgba(128,0,128,0.3)] ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-purple-800"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
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
            <Confetti width={window.innerWidth} height={window.innerHeight} />
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
