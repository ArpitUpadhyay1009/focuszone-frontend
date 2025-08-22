import { createContext, useState, useContext, useEffect } from "react";
export const SelectedTaskContext = createContext();

export const SelectedTaskProvider = ({ children }) => {
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    try {
      if (typeof window === "undefined") return null;
      const stored = localStorage.getItem("selectedTaskId");
      return stored ? stored : null;
    } catch {
      return null;
    }
  });

  // Persist to localStorage whenever selection changes
  useEffect(() => {
    try {
      if (selectedTaskId) {
        localStorage.setItem("selectedTaskId", selectedTaskId);
      } else {
        localStorage.removeItem("selectedTaskId");
      }
    } catch {
      // Ignore storage errors (e.g., privacy mode)
    }
  }, [selectedTaskId]);
  return (
    <SelectedTaskContext.Provider value={{ selectedTaskId, setSelectedTaskId }}>
      {children}
    </SelectedTaskContext.Provider>
  );
};
export const useSelectedTask = () => useContext(SelectedTaskContext);