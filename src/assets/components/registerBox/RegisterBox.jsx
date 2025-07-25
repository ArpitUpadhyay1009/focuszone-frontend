import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./RegisterBox.css";
import GoogleSignIn from "../googleSignIn/GoogleSignIn.jsx";

const RegisterBox = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // New state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Password validation logic
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#!@]).{8,}$/;
    if (!passwordPattern.test(password)) {
      alert(
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one symbol ($, #, @)."
      );
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      alert("Registered successfully! Please verify.");
      window.localStorage.setItem("otpSent", "1");
      window.localStorage.setItem("emailForOtp", email);
      console.log(
        "[RegisterBox] Set otpSent and emailForOtp in localStorage",
        window.localStorage.getItem("otpSent"),
        window.localStorage.getItem("emailForOtp")
      );
      navigate("/verify-otp", { state: { email } }); // Navigate to OTP verification page
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Email or Username already in use!");
        } else {
          alert(`error: ${error}`);
          console.log(error);
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
        <div className="register-box p-6 rounded-lg shadow-lg w-110">
          <h2 className="text-4xl font-[Poppins] text-left font-medium mb-4 register-text">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-[Poppins] register-subtext py-4">
                Please enter the details below to continue.
              </label>
              <label>
                {charCount > 0 && (
                  <p className="text-sm register-subtext mb-1">
                    Character limit: 200
                  </p>
                )}
              </label>
              <input
                type="text"
                placeholder="User Name"
                className="register-input w-full px-3 py-2 font-[Poppins] bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setCharCount(value.length);
                    setUsername(value);
                  }
                }}
                maxLength={200} // Limit input to 200 characters
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="register-input w-full px-3 py-2 bg-gray-200 border-none font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Password"
                className="register-input w-full px-3 py-2 border-none bg-gray-200 font-[Poppins] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10" // Right padding added
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
              />
              {/* Eye Icon Inside the Input Box */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center eye-icon"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {isPasswordFocused && (
              <p className="text-sm text-gray-600 mb-4">
                Password must be at least 8 characters long and include:
                <br />
                - At least one uppercase letter
                <br />
                - At least one lowercase letter
                <br />
                - At least one digit
                <br />- One of these symbols: $ @ ! #
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-purple-700 font-[Poppins] text-white py-2 rounded-lg cursor-pointer hover:bg-purple-800 transition shadow-[0px_-4px_10px_rgba(128,0,128,0.3)]"
            >
              Register
            </button>
          </form>
          {/* Google Sign In Button */}
          <GoogleSignIn />
          <div className="flex justify-center items-center mt-4">
            <p className="register-subtext">Already have an account?</p>
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
