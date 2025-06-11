// src/context/SportsContext.jsx
import { createContext, useContext, useState } from "react";

const SportsContext = createContext();

export const SportsProvider = ({ children }) => {
  const [sport, setSport] = useState("rugby"); // default sport
  return (
    <SportsContext.Provider value={{ sport, setSport }}>
      {children}
    </SportsContext.Provider>
  );
};

export const useSport = () => useContext(SportsContext);