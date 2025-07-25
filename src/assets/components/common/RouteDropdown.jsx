import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";

const ROUTES = [
  { label: "Home", path: "/home" },
  { label: "StudyW.Tok", path: "/studyw.tok" },
  { label: "StudyW.Gram", path: "/studyw.gram" },
];

export default function RouteDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const dropdownRef = useRef(null);

  // Color palette (all rgb)
  const lightBg = "rgb(255,255,255)";
  const lightText = "rgb(34,34,59)";
  const lightBorder = "rgb(209,213,219)";
  const lightDropdownHover = "rgb(243,244,246)";
  const darkBg = "rgb(24,24,27)";
  const darkText = "rgb(243,244,246)";
  const darkBorder = "rgb(34,35,42)";
  const darkDropdownBg = "rgb(35,39,47)";
  const darkDropdownHover = "rgb(45,47,54)";
  const highlightHover = "rgb(237,233,254)";
  const highlightDarkHover = "rgb(59,59,79)";

  const isDark = theme === "dark";

  // Default to /home if not on one of the routes
  const current = ROUTES.find((r) => location.pathname === r.path) || ROUTES[0];

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      style={{ position: "relative", display: "inline-block", minWidth: 120 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-2.5 py-1.5 rounded-md border shadow-sm text-sm font-medium transition-colors duration-200 focus:outline-none`}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          minWidth: 120,
          fontSize: 14,
          padding: "6px 10px",
          background: isDark ? darkBg : lightBg,
          color: isDark ? darkText : lightText,
          borderColor: isDark ? darkBorder : lightBorder,
        }}
      >
        {current.label}
        <span style={{ float: "right", marginLeft: 8, fontSize: 12 }}>
          &#9662;
        </span>
      </button>
      {open && (
        <ul
          className={`absolute left-0 mt-1 w-full rounded-md shadow-lg z-10`}
          style={{
            minWidth: 120,
            fontSize: 14,
            background: isDark ? darkDropdownBg : lightBg,
            color: isDark ? darkText : lightText,
            borderColor: isDark ? darkBorder : lightBorder,
            borderStyle: "solid",
            borderWidth: 1,
          }}
          role="listbox"
        >
          {ROUTES.map((route) => (
            <li
              key={route.path}
              className={`px-2.5 py-1.5 cursor-pointer transition-colors duration-150`}
              style={{
                background:
                  route.path === current.path
                    ? isDark
                      ? darkDropdownHover
                      : lightDropdownHover
                    : "transparent",
                color:
                  route.path === current.path
                    ? isDark
                      ? darkText
                      : lightText
                    : undefined,
              }}
              onClick={() => {
                setOpen(false);
                if (route.path !== current.path) navigate(route.path);
              }}
              role="option"
              aria-selected={route.path === current.path}
              onMouseOver={(e) => {
                e.currentTarget.style.background = isDark
                  ? highlightDarkHover
                  : highlightHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  route.path === current.path
                    ? isDark
                      ? darkDropdownHover
                      : lightDropdownHover
                    : "transparent";
              }}
            >
              {route.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
