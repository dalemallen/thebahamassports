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

      setUserLoading(true);

      try {
        // always ask DB first
        const res = await axios.get(`/api/users/me/${auth0User.sub}`);
        const userFromDb = res.data;

        const teamData =
          userFromDb.role === "team"
            ? (await axios.get(`/api/teams/creator/${userFromDb.id}`)).data?.[0] || null
            : null;

        const fullUser = {
          ...auth0User,
          ...userFromDb,
          team: teamData,
          team_id: teamData?.id || null,
        };

        setUser(fullUser);
        setDbUser(fullUser);
        setRole(userFromDb.role); // 📌 only take role from DB
        sessionStorage.removeItem("pendingRole"); // no longer needed

        redirectBasedOnOnboarding(userFromDb);
      } catch (err) {
        if (err.response?.status === 404) {
          // user not in DB → register with pendingRole
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
          setRole(newUser.role); // 📌 newUser.role comes from DB at insert time
          sessionStorage.removeItem("pendingRole");

          navigate(`/onboard/${newUser.role}`);
        } else {
          console.error("❌ Failed to fetch or register user:", err);
        }
      } finally {
        setUserLoading(false);
      }
    };

    const redirectBasedOnOnboarding = (userFromDb) => {
      const isOnboardingRoute = location.pathname.startsWith("/onboard/");
      const isDashboardRoute = location.pathname.startsWith("/dashboard/");

      if (!userFromDb.onboarding_complete && !isOnboardingRoute) {
        navigate(`/onboard/${userFromDb.role}`);
      } else if (userFromDb.onboarding_complete && isOnboardingRoute) {
        navigate(`/dashboard/${userFromDb.role}`);
      }
    };

    if (isAuthenticated && auth0User) {
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
