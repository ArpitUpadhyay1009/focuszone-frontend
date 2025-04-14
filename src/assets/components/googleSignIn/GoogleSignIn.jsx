// src/components/GoogleLoginButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./GoogleSignIn.css";

const GoogleLoginButton = () => {
    const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const response = await axios.post("/api/auth/google-login", {
        idToken: credential,
      });

      const { token, user } = response.data;

      // Save token and user info (optional: context, localStorage)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

    //   console.log("✅ Logged in:", user);
      navigate("/home")      // Redirect or show success toast

    } catch (err) {
    //   console.error("❌ Login failed", err.response?.data || err.message);
      alert("Login failed. Try again.");
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
