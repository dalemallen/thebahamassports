import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Home from "./pages/Home.jsx";
import DashboardAthlete from "./pages/DashboardAthlete.jsx";
import DashboardCoach from "./pages/DashboardCoach.jsx";
import DashboardFederation from "./pages/DashboardFederation.jsx";
import DashboardOrganizer from "./pages/DashboardOrganizer.jsx";
import DashboardTeam from "./pages/DashboardTeam.jsx";
import DashboardParent from "./pages/DashboardParent.jsx";
import DashboardSponsor from "./pages/DashboardSponsor.jsx";
import DashboardScout from "./pages/DashboardScout.jsx";

function RedirectHandler() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const roles = user?.["https://thebahamassports.com/roles"] || [];

    // Prioritize one role for redirect — first match wins
    if (roles.includes("athlete")) navigate("/dashboard/athlete", { replace: true });
    else if (roles.includes("coach")) navigate("/dashboard/coach", { replace: true });
    else if (roles.includes("federation")) navigate("/dashboard/federation", { replace: true });
    else if (roles.includes("organizer")) navigate("/dashboard/organizer", { replace: true });
    else if (roles.includes("team")) navigate("/dashboard/team", { replace: true });
    else if (roles.includes("parent")) navigate("/dashboard/parent", { replace: true });
    else if (roles.includes("sponsor")) navigate("/dashboard/sponsor", { replace: true });
    else if (roles.includes("scout")) navigate("/dashboard/scout", { replace: true });
    else navigate("/dashboard", { replace: true }); // fallback
  }, [isAuthenticated, isLoading, user, navigate]);

  return null;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/redirect" element={<RedirectHandler />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard/athlete" element={<DashboardAthlete />} />
      <Route path="/dashboard/coach" element={<DashboardCoach />} />
      <Route path="/dashboard/federation" element={<DashboardFederation />} />
      <Route path="/dashboard/organizer" element={<DashboardOrganizer />} />
      <Route path="/dashboard/team" element={<DashboardTeam />} />
      <Route path="/dashboard/parent" element={<DashboardParent />} />
      <Route path="/dashboard/sponsor" element={<DashboardSponsor />} />
      <Route path="/dashboard/scout" element={<DashboardScout />} />
    </Routes>
  );
}
