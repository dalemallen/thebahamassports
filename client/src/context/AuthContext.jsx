import { useAuth0 } from "@auth0/auth0-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: auth0User, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated || !auth0User) {
        setUserLoading(false);
        return;
      }

      try {
        // 1. Fetch user from DB
        const res = await axios.get(`/api/users/${auth0User.sub}`);
        const userFromDb = res.data;

        // 2. Optionally fetch team info
        let teamData = null;
        if (userFromDb.role === "team") {
          const teamRes = await axios.get(`/api/teams/creator/${userFromDb.id}`);
          teamData = teamRes.data?.[0] || null;
        }

        // 3. Merge user objects
        const fullUser = {
          ...auth0User,
          ...userFromDb,
          team: teamData,
          team_id: teamData?.id || null,
        };

        setUser(fullUser);
        setDbUser(fullUser);
        setRole(userFromDb.role);
        sessionStorage.removeItem("pendingRole");

        // 4. Redirect based on onboarding status
        const isOnboardingRoute = location.pathname.startsWith("/onboard/");
        const isDashboardRoute = location.pathname.startsWith("/dashboard/");

        if (!userFromDb.onboarding_complete && !isOnboardingRoute) {
          navigate(`/onboard/${userFromDb.role}`);
        } else if (userFromDb.onboarding_complete && isOnboardingRoute) {
          navigate(`/dashboard/${userFromDb.role}`);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // 5. Register new user if not found
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
          setUser(fullUser);
          setDbUser(fullUser);
          setRole(pendingRole);
          sessionStorage.removeItem("pendingRole");
          navigate(`/onboard/${pendingRole}`);
        } else {
          console.error("❌ Failed to fetch or register user:", err);
        }
      } finally {
        setUserLoading(false);
      }
    };

    if (isAuthenticated && auth0User) {
      setUserLoading(true);
      loadUser();
    } else {
      setUserLoading(false);
    }
  }, [auth0User, isAuthenticated, location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        role,
        setRole,
        isAuthenticated,
        isLoading: auth0Loading || userLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
