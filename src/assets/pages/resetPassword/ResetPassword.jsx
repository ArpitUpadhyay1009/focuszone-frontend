// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AnimatedBackground from "@components/AnimatedBackground/AnimatedBackground.jsx";
import Navbar from "@components/navbar/Navbar.jsx";
import { Eye, EyeOff } from "lucide-react";
import "@components/registerBox/RegisterBox.css";
import Footer from "@components/footer/Footer.jsx";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // New state

  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromSession = window.sessionStorage.getItem("emailForOtp");
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromSession) {
      setEmail(emailFromSession);
    } else {
      navigate("/forgot-password", { replace: true });
    }
  }, [location.state, navigate]);

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!#])[A-Za-z\d$@!#]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      return setError("Email not found. Please restart the reset process.");
    }

    if (password !== confirm) {
      return setError("Passwords don't match");
    }

    if (!validatePassword(password)) {
      window.alert(
        "Password must be at least 8 characters long and include:\n" +
          "- At least one uppercase letter\n" +
          "- At least one lowercase letter\n" +
          "- At least one digit\n" +
          "- One of these symbols: $ @ ! #"
      );
      return setPassword(""), setConfirm("");
    }

    try {
      const res = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      setMessage(res.data.message);
      window.sessionStorage.removeItem("resetVerified");
      window.sessionStorage.removeItem("emailForOtp");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <div className="flex justify-center items-center bg-transparent mt-[10%]">
        <div className="register-box p-6 rounded-lg shadow-lg w-110">
          <h2 className="text-4xl font-[Poppins] text-left font-medium mb-4 register-text">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              required
              className="register-input w-full p-2 border rounded mb-4"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="register-input w-full p-2 border rounded"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-sm text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
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
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="register-input w-full p-2 border rounded"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white p-2 rounded"
            >
              Reset Password
            </button>
          </form>
          {message && <p className="text-green-600 mt-4">{message}</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
      <div className="mt-[14%]">
        <Footer />
      </div>
    </>
  );
};

export default ResetPassword;
