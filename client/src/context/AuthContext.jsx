import { useAuth0 } from "@auth0/auth0-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated || !auth0User) return;

      try {
        // Get existing user from DB
        const res = await axios.get(`/api/users/${auth0User.sub}`);
        const userFromDb = res.data;

        // Load team if user is a team-type user
        let teamData = null;
        if (userFromDb.role === "team") {
          const teamRes = await axios.get(`/api/teams/creator/${userFromDb.id}`);
          teamData = teamRes.data?.[0] || null;
        }

        // Update states
        const fullUser = { ...auth0User, ...userFromDb, team: teamData, team_id: teamData?.id || null };
        setDbUser(fullUser);
        setRole(userFromDb.role);
        setUser(fullUser);

        // Redirect if onboarding is incomplete
        if (!userFromDb.onboarding_complete) {
          navigate(`/onboard/${userFromDb.role}`);
        }
      } catch (err) {
        // Register new user if not found
        if (err.response?.status === 404) {
          const pendingRole = sessionStorage.getItem("pendingRole") || "athlete";

          const payload = {
            auth0_id: auth0User.sub,
            email: auth0User.email,
            first_name: auth0User.given_name || "",
            last_name: auth0User.family_name || "",
            role: pendingRole,
          };

          const regRes = await axios.post(`/api/users/register-user`, payload);
          const newUser = regRes.data;

          const fullUser = { ...auth0User, ...newUser };
          setDbUser(fullUser);
          setRole(pendingRole);
          setUser(fullUser);

          sessionStorage.removeItem("pendingRole");
          navigate(`/onboard/${pendingRole}`);
        } else {
          console.error("Failed to fetch/create user", err);
        }
      }
    };

    loadUser();
  }, [auth0User, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, role, setRole, isAuthenticated, isLoading, dbUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
