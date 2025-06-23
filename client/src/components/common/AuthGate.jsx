import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AuthGate({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    if (!user.onboarding_complete && !location.pathname.startsWith("/onboard")) {
      navigate(`/onboard/${user.role}`, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, location.pathname, navigate]);

  return children;
}
