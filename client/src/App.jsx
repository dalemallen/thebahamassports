import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PageLoader from "./components/PageLoader.jsx";

// Layouts & Core Pages
const Headers = lazy(() => import("./components/common/Header.jsx"));
const Footer = lazy(() => import("./components/common/Footer.jsx"));
const Home = lazy(() => import("./pages/home/Home.jsx"));
const Pricing = lazy(() => import("./pages/pricing/Pricing.jsx"));
const Unauthorized = lazy(() => import("./pages/Unauthorized.jsx"));
const RedirectHandler = lazy(() => import("./components/auth/RedirectHandler.jsx"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute.jsx"));
const Onboard = lazy(() => import("./pages/onboard/Onboard.jsx"));

// Dashboards by Role
const roleDashboards = {
  athlete: lazy(() => import("./pages/dashboard/DashboardAthlete.jsx")),
  coach: lazy(() => import("./pages/dashboard/DashboardCoach.jsx")),
  federation: lazy(() => import("./pages/dashboard/DashboardFederation.jsx")),
  organizer: lazy(() => import("./pages/dashboard/DashboardOrganizer.jsx")),
  team: lazy(() => import("./pages/dashboard/DashboardTeam.jsx")),
  parent: lazy(() => import("./pages/dashboard/DashboardParent.jsx")),
  sponsor: lazy(() => import("./pages/dashboard/DashboardSponsor.jsx")),
  scout: lazy(() => import("./pages/dashboard/DashboardScout.jsx"))
};

// Feature Pages
const FederationDetails = lazy(() => import("./pages/federations/FederationDetails.jsx"));
const LeaguesPage = lazy(() => import("./pages/leagues/LeaguesPage.jsx"));
const LeagueDetails = lazy(() => import("./pages/leagues/LeagueDetails.jsx"));
const TournamentsPage = lazy(() => import("./pages/tournaments/TournamentsPage.jsx"));
const TournamentDetails = lazy(() => import("./pages/tournaments/TournamentDetails.jsx"));
const TeamsPage = lazy(() => import("./pages/teams/TeamsPage.jsx"));
const TeamDetails = lazy(() => import("./pages/teams/TeamDetails.jsx"));
const TeamPlayers = lazy(() => import("./components/teams/TeamPlayers.jsx"));
const PlayersList = lazy(() => import("./components/players/PlayersList.jsx"));
const PlayerDetails = lazy(() => import("./pages/players/PlayerDetails.jsx"));
const EventLists = lazy(() => import("./components/events/EventLists.jsx"));
const EventDetails = lazy(() => import("./pages/events/EventDetails.jsx"));
const EventTeams = lazy(() => import("./components/events/EventTeams.jsx"));
const EventResults = lazy(() => import("./components/events/EventResults.jsx"));
const SchedulePage = lazy(() => import("./pages/schedules/SchedulePage.jsx"));

export default function App() {
  const { user, isAuthenticated } = useAuth0();
  const userRole = user?.["https://thebahamassports.com/roles"]?.[0];
  const onboardingComplete = user?.onboarding_complete;

  return (
    <Suspense fallback={<PageLoader />}>
      <Headers />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<RedirectHandler />} />
        <Route path="/redirect" element={<RedirectHandler />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboard/:role" element={<Onboard />} />

        {/* Dynamic Redirect to Dashboard */}
        <Route
          path="/dashboard"
          element={
            user && onboardingComplete && userRole ? (
              <Navigate to={`/dashboard/${userRole}`} replace />
            ) : userRole ? (
              <Navigate to={`/onboard/${userRole}`} replace />
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          }
        />

        {/* Dashboards by Role */}
        {Object.entries(roleDashboards).map(([role, Component]) => (
          <Route
            key={role}
            path={`/dashboard/${role}`}
            element={
              <ProtectedRoute requiredRole={role}>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}

        {/* Feature Pages */}
        <Route path="/sports/:sportId" element={<FederationDetails />} />
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/leagues/:leagueId" element={<LeagueDetails />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:tournamentId" element={<TournamentDetails />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:teamId" element={<TeamDetails />} />
        <Route path="/teams/:teamId/players" element={<TeamPlayers />} />
        <Route path="/teams/:teamId/player/:playerId" element={<PlayerDetails />} />
        <Route path="/players" element={<PlayersList />} />
        <Route path="/players/:playerId" element={<PlayerDetails />} />
        <Route path="/events" element={<EventLists />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:eventId/teams" element={<EventTeams />} />
        <Route path="/events/:eventId/results" element={<EventResults />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/schedule/:federationId" element={<EventResults />} />
        <Route path="/schedule/:userId" element={<EventResults />} />
      </Routes>
      <Footer />
    </Suspense>
  );
}
