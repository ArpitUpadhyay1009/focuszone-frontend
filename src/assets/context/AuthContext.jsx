import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Configure axios defaults
axios.defaults.withCredentials = true; // Enable sending cookies with requests

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from Cookies
    const savedUser = Cookies.get("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse user cookie:", e);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Persist user state to Cookies whenever it changes
  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user), { expires: 90 }); // Cookie expires in 90 days
    } else {
      Cookies.remove("user");
    }
  }, [user]);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/verify-session", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (response.data.isValid) {
          setUser(response.data.user);
        } else {
          // Only clear user state if the session is explicitly invalid
          setUser(null);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        // Don't clear user state on network errors
        if (error.response && error.response.status === 401) {
          // Only clear user if the server explicitly says the token is invalid
          setUser(null);
        }
        // For other errors, keep the current user state
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (userData) => {
    try {
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      Cookies.remove("user"); // Also remove the user cookie on logout
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
