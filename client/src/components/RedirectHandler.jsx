import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

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
  console.log('redirecting...');
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log('user: ', user);
  const navigate = useNavigate();
  const location = useLocation();

  const roles = useMemo(() => user?.["https://thebahamassports.com/roles"] || [], [user]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    for (const role of Object.keys(roleRedirectMap)) {
      if (roles.includes(role)) {
        navigate(roleRedirectMap[role], { replace: true });
        return;
      }
    }

    // fallback to home with query to trigger toast/banner
    navigate("/?unauthorized=true", { replace: true });
  }, [isAuthenticated, isLoading, roles, navigate]);

  return null;
}
