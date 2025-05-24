import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get token from cookie instead of localStorage
        const token = Cookies.get("token");
        
        if (token) {
          // Verify token with the server
          const response = await axios.get("/api/auth/verify-session", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.valid) {
            // Get user data from cookie
            const userData = Cookies.get("user");
            if (userData) {
              setUser(JSON.parse(userData));
            }
          } else {
            // Token is invalid or expired
            Cookies.remove("token");
            Cookies.remove("user");
          }
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        // Clear invalid session data
        Cookies.remove("token");
        Cookies.remove("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (userData, token) => {
    // Set cookie options for 48 hours
    const cookieOptions = { 
      expires: 2, // 2 days
      secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
      sameSite: 'strict' // Protect against CSRF
    };
    
    // Store user data and token in cookies
    Cookies.set("user", JSON.stringify(userData), cookieOptions);
    Cookies.set("token", token, cookieOptions);
    
    // Update auth state
    setUser(userData);
    
    // Set up session with the server
    try {
      await axios.post("/api/auth/persist-session", 
        { expiresIn: '48h' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error("Failed to set up persistent session:", error);
    }
  };

  const logout = () => {
    const token = Cookies.get("token");
    
    // Notify server about logout
    if (token) {
      axios.post("/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Logout error:", err));
    }
    
    // Clear cookies
    Cookies.remove("user");
    Cookies.remove("token");
    
    // Update auth state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
