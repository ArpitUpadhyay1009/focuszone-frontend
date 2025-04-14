import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@context/ThemeContext.jsx";
import { AuthProvider } from "@context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId="467586525110-u1a6sdumm6jqtgq2arvqrm1rkrusair2.apps.googleusercontent.com">
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
  </React.StrictMode>
);
