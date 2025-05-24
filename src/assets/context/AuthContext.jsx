import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token) {
          // Verify token with the server
          const response = await axios.get("/api/auth/verify-session", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.valid) {
            setUser(JSON.parse(localStorage.getItem("user")));
          } else {
            // Token is invalid or expired
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        // Clear invalid session data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (userData, token) => {
    // Set session expiration to 48 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    
    // Store user data, token and expiration
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("sessionExpires", expiresAt.toISOString());
    
    // Update auth state
    setUser(userData);
    
    // Set up session with the server
    try {
      await axios.post("/api/auth/persist-session", 
        { expiresAt: expiresAt.toISOString() },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error("Failed to set up persistent session:", error);
    }
  };

  const logout = () => {
    const token = localStorage.getItem("token");
    
    // Notify server about logout
    if (token) {
      axios.post("/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Logout error:", err));
    }
    
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionExpires");
    
    // Update auth state
    setUser(null);
  };

  // Check if session is expired
  useEffect(() => {
    const checkSessionExpiration = () => {
      const expiresAt = localStorage.getItem("sessionExpires");
      
      if (expiresAt) {
        const now = new Date();
        const expiration = new Date(expiresAt);
        
        if (now > expiration) {
          // Session expired, log out
          logout();
        }
      }
    };
    
    // Check on load and periodically
    checkSessionExpiration();
    const interval = setInterval(checkSessionExpiration, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
