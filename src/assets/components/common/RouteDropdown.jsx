import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ROUTES = [
  { label: "Home", path: "/home" },
  { label: "StudyW.Tok", path: "/studyw.tok" },
  { label: "StudyW.Gram", path: "/studyw.gram" },
];

export default function RouteDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Default to /home if not on one of the routes
  const current = ROUTES.find((r) => location.pathname === r.path) || ROUTES[0];

  // Detect dark mode from document or fallback to light
  const isDark =
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark");

  return (
    <div
      style={{ position: "relative", display: "inline-block", minWidth: 160 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-2 rounded-lg border shadow-sm text-base font-medium transition-colors duration-200 focus:outline-none
          ${
            isDark
              ? "bg-[#18181b] text-white border-[#333]"
              : "bg-white text-black border-gray-300"
          }
          dark:bg-[#18181b] dark:text-white dark:border-[#333]`}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={
          isDark
            ? { background: "#18181b", color: "#fff", borderColor: "#333" }
            : {}
        }
      >
        {current.label}
        <span style={{ float: "right", marginLeft: 8 }}>&#9662;</span>
      </button>
      {open && (
        <ul
          className={`absolute left-0 mt-2 w-full rounded-lg shadow-lg z-10
            ${
              isDark
                ? "bg-[#23272f] border border-[#333] text-white"
                : "bg-white border border-gray-200 text-black"
            }
            dark:bg-[#23272f] dark:text-white dark:border-[#333]`}
          style={
            isDark
              ? { background: "#23272f", color: "#fff", borderColor: "#333" }
              : {}
          }
          role="listbox"
        >
          {ROUTES.map((route) => (
            <li
              key={route.path}
              className={`px-4 py-2 cursor-pointer transition-colors duration-150
                ${
                  route.path === current.path
                    ? isDark
                      ? "bg-[#2d2f36] text-white"
                      : "bg-gray-100 text-black"
                    : ""
                }
                hover:bg-purple-100 dark:hover:bg-[#3b3b4f]`}
              style={
                route.path === current.path && isDark
                  ? { background: "#2d2f36", color: "#fff" }
                  : {}
              }
              onClick={() => {
                setOpen(false);
                if (route.path !== current.path) navigate(route.path);
              }}
              role="option"
              aria-selected={route.path === current.path}
            >
              {route.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
