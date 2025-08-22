import { createContext, useState, useContext, useEffect, useRef } from "react";
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
  const hasAutoLoggedOutRef = useRef(false);

  // Inactivity threshold for auto-logout (e.g., 12 hours)
  const INACTIVITY_LOGOUT_THRESHOLD_MS = 12 * 60 * 60 * 1000;

  // Helper to safely clear storage and cookies
  const safeLocalCleanup = () => {
    try {
      // Clear all local storage
      localStorage.clear();
    } catch {}

    try {
      // Clear all cookies (best-effort)
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    } catch {}
  };

  // Helper to add a timeout to a promise
  const withTimeout = (promise, ms, timeoutMessage = "Request timed out") => {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
    });
    return Promise.race([promise.finally(() => clearTimeout(timer)), timeout]);
  };

  // Persist user state to Cookies whenever it changes
  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user), { expires: 90 }); // Cookie expires in 90 days
    } else {
      Cookies.remove("user");
    }
  }, [user]);

  // Track last active timestamp to detect long background/sleep and auto-logout
  useEffect(() => {
    const markActive = () => {
      try {
        localStorage.setItem("lastActiveAt", String(Date.now()));
      } catch {}
    };

    // Mark immediately and then on visibility/focus and periodically
    markActive();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        markActive();
      }
    };
    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", markActive);
    const interval = setInterval(markActive, 60 * 1000);

    return () => {
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", markActive);
      clearInterval(interval);
    };
  }, []);

  // Check for existing session on initial load, with inactivity and timeout protection
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const now = Date.now();
        const lastActiveRaw = localStorage.getItem("lastActiveAt");
        const lastActiveAt = lastActiveRaw ? parseInt(lastActiveRaw, 10) : null;

        // If device/browser was inactive for a long time, force logout for a clean state
        if (
          !hasAutoLoggedOutRef.current &&
          lastActiveAt &&
          now - lastActiveAt > INACTIVITY_LOGOUT_THRESHOLD_MS
        ) {
          hasAutoLoggedOutRef.current = true;
          safeLocalCleanup();
          setUser(null);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const response = await withTimeout(
          axios.get("/api/auth/verify-session", {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }),
          8000,
          "Session verification timed out"
        );

        if (response.data.isValid) {
          setUser(response.data.user);
        } else {
          // Only clear user state if the session is explicitly invalid
          setUser(null);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        // If unauthorized or timed out, reset to a clean state to avoid app hang
        if (
          (error.response && error.response.status === 401) ||
          /timed out/i.test(error.message || "")
        ) {
          safeLocalCleanup();
          setUser(null);
        }
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
      const token = localStorage.getItem("token");

      // Local cleanup first to ensure UI recovers immediately
      safeLocalCleanup();
      setUser(null);

      // Then make the API call to invalidate the session (with timeout)
      try {
        await withTimeout(
          axios.post(
            "/api/auth/logout",
            null,
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              withCredentials: true, // Ensure cookies are sent with the request
            }
          ),
          5000,
          "Logout request timed out"
        );
      } catch (apiError) {
        console.error("Logout API error:", apiError);
        // Even if the API call fails, we still proceed with local cleanup (already done)
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still ensure we clean up local state even if there's an error
      safeLocalCleanup();
      setUser(null);
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
