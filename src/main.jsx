import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@context/ThemeContext.jsx";
import { AuthProvider } from "@context/AuthContext.jsx";
import { SelectedTaskProvider } from "@context/SelectedTaskContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId="104205854492-dmhesporr30rf1gf4khf07q0s3qkcqau.apps.googleusercontent.com">
    <AuthProvider>
      <ThemeProvider>
        <SelectedTaskProvider>
          <App />
        </SelectedTaskProvider>
      </ThemeProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
  </React.StrictMode>
);
