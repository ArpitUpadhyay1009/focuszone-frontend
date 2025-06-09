import { createContext, useState, useContext } from "react";
export const SelectedTaskContext = createContext();

export const SelectedTaskProvider = ({ children }) => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  return (
    <SelectedTaskContext.Provider value={{ selectedTaskId, setSelectedTaskId }}>
      {children}
    </SelectedTaskContext.Provider>
  );
};
export const useSelectedTask = () => useContext(SelectedTaskContext);