import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

// Configure axios defaults
axios.defaults.withCredentials = true; // Enable sending cookies with requests

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/auth/verify-session");
        
        if (response.data.isValid) {
          setUser(response.data.user);
        } else {
          // Clear user state if session is invalid
          setUser(null);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (userData, token) => {
    try {
      // The backend will set the HTTP-only cookie automatically
      // We only need to update the user state
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint - backend will clear the HTTP-only cookie
      await axios.post("/api/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
