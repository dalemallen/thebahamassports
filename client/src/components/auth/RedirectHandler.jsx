import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../context/AuthContext";
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
  const { user, role,setRole, isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const pendingRole =

    location.state?.appState?.role ||
    sessionStorage.getItem("pendingRole") ||
    "athlete";
  console.log('pendingRole: ', pendingRole);
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const handleRedirect = async () => {
      try {
        const auth0_id = user.sub;

        sessionStorage.setItem("pendingRole", pendingRole);
        const res = await axios.get(`/api/users/${auth0_id}`);
        const existingUser = res.data;

        sessionStorage.removeItem("pendingRole");
        setRole(existingUser.role);

        if (!existingUser.onboarding_complete) {
          navigate(`/onboard/${existingUser.role}`, { replace: true });
        } else {
          navigate(roleRedirectMap[existingUser.role] || `/dashboard/${existingUser.role}`, {
            replace: true,
          });
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // New user
          try {
            const registerPayload = {
              auth0_id: user.sub,
              email: user.email,
              first_name: user.given_name || "",
              last_name: user.family_name || "",
              role: pendingRole,
            };

            const registerRes = await axios.post(`/api/users/register-user`, registerPayload);
            const newUser = registerRes.data;

            sessionStorage.removeItem("pendingRole");
            setRole(newUser.role);
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
  }, [isAuthenticated, isLoading, user, location.state, navigate, setRole]);

  return <p>Redirecting...</p>;
}
