import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Add this import
import "./GoogleSignIn.css";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      console.log("Google credential received:", credential);

      const response = await axios.post(
        "/api/auth/google-login",
        {
          idToken: credential,
          rememberMe: true, // Request persistent session
        },
        { withCredentials: true }
      );

      const { user } = response.data;
      login(user); // Only pass user, not token

      // ✅ Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(
        "❌ Google login failed",
        err.response?.data || err.message
      );
      alert("Google login failed. Try again.");
    }
  };

  const handleError = () => {
    console.error("Google login failed");
    alert("Google login failed. Please try again.");
  };

  return (
    <div className="flex justify-center mt-4">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleLoginButton;
