// Add these imports
import { useAuth0 } from "@auth0/auth0-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();

  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || isLoading || !auth0User) return;

    const loadUser = async () => {
      try {
        const res = await axios.get(`/api/users/${auth0User.sub}`);
        setUser(res.data);
        setSelectedRole(res.data.role);
      } catch (err) {
        if (err.response?.status === 404) {
          const role = sessionStorage.getItem("pendingRole") || "athlete";
          const payload = {
            auth0_id: auth0User.sub,
            email: auth0User.email,
            first_name: auth0User.given_name || "",
            last_name: auth0User.family_name || "",
            role,
          };

          const regRes = await axios.post(`/api/users/register-user`, payload);
          setUser(regRes.data);
          setSelectedRole(role);
          sessionStorage.removeItem("pendingRole");
        } else {
          console.error("Error fetching/creating user", err);
        }
      }
    };

    loadUser();
  }, [auth0User, isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={{ user, selectedRole, setSelectedRole }}>
      {children}
    </AuthContext.Provider>
  );
};
