import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let storedUser = null;
  let storedToken = localStorage.getItem("token") || null;

  try {
    const userData = localStorage.getItem("user");
    storedUser = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    storedUser = null;
  }

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (userData, userToken) => {
    if (userData && typeof userData === "object") {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      // console.warn("Invalid userData in login:", userData);
      localStorage.removeItem("user");
      setUser(null);
    }

    if (userToken) {
      localStorage.setItem("token", userToken);
      setToken(userToken);
    } else {
      console.warn("Invalid token in login");
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
