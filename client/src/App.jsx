
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DashboardAthlete from "./pages/DashboardAthlete.jsx";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function RedirectHandler() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const roles = user["https://thebahamassports.com/roles"] || [];
    if (roles.includes("athlete")) navigate("/dashboard/athlete");
    else navigate("/dashboard");
  }, [isAuthenticated, isLoading]);

  return null;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard/athlete" element={<DashboardAthlete />} />
      <Route path="/redirect" element={<RedirectHandler />} />
    </Routes>
  );
}
