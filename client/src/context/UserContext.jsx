import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // ✅ Pull from AuthContext

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
