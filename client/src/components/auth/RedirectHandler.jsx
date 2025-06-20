import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const roleRedirectMap = {
  athlete: "/dashboard/athlete",
  coach: "/dashboard/coach",
  federation: "/dashboard/federation",
  organizer: "/dashboard/organizer",
  team: "/dashboard/team",
  parent: "/dashboard/parent",
  sponsor: "/dashboard/sponsor",
  scout: "/dashboard/scout",
};

export default function RedirectHandler() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  const roleFromAppState =
    location.state?.appState?.role || sessionStorage.getItem("pendingRole") || "athlete";

  const rolesFromToken = useMemo(
    () => user?.["https://thebahamassports.com/roles"] || [],
    [user]
  );

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const handleRedirect = async () => {
      try {
        const auth0_id = user.sub;

        // 🔍 1. Check if user already exists in DB
        const res = await axios.get(`/api/users/${auth0_id}`);
        const existingUser = res.data;

        // ✅ 2. Existing user: route by onboarding
        sessionStorage.removeItem("pendingRole");
        const role = existingUser.role;

        if (!existingUser.onboarding_complete) {
          navigate(`/onboard/${role}`, { replace: true });
        } else {
          navigate(roleRedirectMap[role] || `/dashboard/${role}`, { replace: true });
        }

      } catch (err) {
        if (err.response?.status === 404) {
          // 🆕 3. Register new user
          try {
            const registerPayload = {
              auth0_id: user.sub,
              email: user.email,
              first_name: user.given_name || "",
              last_name: user.family_name || "",
              role: roleFromAppState,
            };

            const registerRes = await axios.post(`/api/users/register-user`, registerPayload);
            const newUser = registerRes.data;

            sessionStorage.removeItem("pendingRole");
            navigate(`/onboard/${newUser.role}`, { replace: true });

          } catch (registrationError) {
            console.error("Registration failed:", registrationError);
            sessionStorage.removeItem("pendingRole");
            navigate("/?account_error=true", { replace: true });
          }

        } else {
          console.error("User lookup failed:", err);
          sessionStorage.removeItem("pendingRole");
          navigate("/?account_error=true", { replace: true });
        }
      }
    };

    handleRedirect();
  }, [isAuthenticated, isLoading, user, location.state, navigate]);

  return <p>Redirecting...</p>;
}
