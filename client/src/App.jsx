import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PageLoader from "./components/PageLoader.jsx";

// Core
const Home = lazy(() => import("./pages/home/Home.jsx"));
const RedirectHandler = lazy(() => import("./components/auth/RedirectHandler.jsx"));
const Unauthorized = lazy(() => import("./pages/Unauthorized.jsx"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute.jsx"));
const Headers = lazy(() => import("./components/common/Header.jsx"));
const Footer = lazy(() => import("./components/common/Footer.jsx"));
const Pricing = lazy(() => import("./pages/pricing/Pricing.jsx"));
const Onboard = lazy(() => import("./pages/onboard/Onboard.jsx"));

// Dashboards by role
const DashboardAthlete = lazy(() => import("./pages/dashboard/DashboardAthlete.jsx"));
const DashboardCoach = lazy(() => import("./pages/dashboard/DashboardCoach.jsx"));
const DashboardFederation = lazy(() => import("./pages/dashboard/DashboardFederation.jsx"));
const DashboardOrganizer = lazy(() => import("./pages/dashboard/DashboardOrganizer.jsx"));
const DashboardTeam = lazy(() => import("./pages/dashboard/DashboardTeam.jsx"));
const DashboardParent = lazy(() => import("./pages/dashboard/DashboardParent.jsx"));
const DashboardSponsor = lazy(() => import("./pages/dashboard/DashboardSponsor.jsx"));
const DashboardScout = lazy(() => import("./pages/dashboard/DashboardScout.jsx"));

// Sports & Federations
const SportsList = lazy(() => import("./components/sports/SportsList.jsx"));
const SportsDetails = lazy(() => import("./pages/SportsDetails.jsx"));
const FederationsList = lazy(() => import("./components/federations/FederationsList.jsx"));
const FederationDetails = lazy(() => import("./pages/federations/FederationDetails.jsx"));

// Leagues & Tournaments
const LeaguesPage = lazy(() => import("./pages/leagues/LeaguesPage.jsx"));
const LeagueDetails = lazy(() => import("./pages/leagues/LeagueDetails.jsx"));
const TournamentsPage = lazy(() => import("./pages/tournaments/TournamentsPage.jsx"));
const TournamentDetails = lazy(() => import("./pages/tournaments/TournamentDetails.jsx"));

// Teams & Players
const TeamsPage = lazy(() => import("./pages/teams/TeamsPage.jsx"));
const TeamsList = lazy(() => import("./components/teams/TeamsList.jsx"));
const TeamDetails = lazy(() => import("./pages/teams/TeamDetails.jsx"));
const TeamPlayers = lazy(() => import("./components/teams/TeamPlayers.jsx"));
const PlayerDetails = lazy(() => import("./pages/players/PlayerDetails.jsx"));
const PlayersList = lazy(() => import("./components/players/PlayersList.jsx"));

// Events
const EventLists = lazy(() => import("./components/events/EventLists.jsx"));
const EventDetails = lazy(() => import("./pages/events/EventDetails.jsx"));
const EventTeams = lazy(() => import("./components/events/EventTeams.jsx"));
const EventResults = lazy(() => import("./components/events/EventResults.jsx"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Headers />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<RedirectHandler />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboard" element={<Onboard />} />

        {/* Dashboards by Role */}
        <Route
          path="/dashboard/athlete"
          element={
            <ProtectedRoute requiredRole="athlete">
              <DashboardAthlete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/coach"
          element={
            <ProtectedRoute requiredRole="coach">
              <DashboardCoach />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/federation"
          element={
            <ProtectedRoute requiredRole="federation">
              <DashboardFederation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/organizer"
          element={
            <ProtectedRoute requiredRole="organizer">
              <DashboardOrganizer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team"
          element={
            <ProtectedRoute requiredRole="team">
              <DashboardTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent"
          element={
            <ProtectedRoute requiredRole="parent">
              <DashboardParent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sponsor"
          element={
            <ProtectedRoute requiredRole="sponsor">
              <DashboardSponsor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/scout"
          element={
            <ProtectedRoute requiredRole="scout">
              <DashboardScout />
            </ProtectedRoute>
          }
        />

        {/* Sports & Federations */}
        <Route path="/sports" element={<SportsList />} />
        <Route path="/sports/:sportId" element={<SportsDetails />} />
        <Route path="/federations" element={<FederationsList />} />
        <Route path="/federations/:federationId" element={<FederationDetails />} />

        {/* Leagues & Tournaments */}
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/leagues/:leagueId" element={<LeagueDetails />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:tournamentId" element={<TournamentDetails />} />

        {/* Teams & Players */}
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:teamId" element={<TeamDetails />} />
        <Route path="/teams/:teamId/players" element={<TeamPlayers />} />
        <Route path="/teams/:teamId/player/:playerId" element={<PlayerDetails />} />
        <Route path="/players" element={<PlayersList />} />
        <Route path="/players/:playerId" element={<PlayerDetails />} />

        {/* Events */}
        <Route path="/events" element={<EventLists />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:eventId/teams" element={<EventTeams />} />
        <Route path="/events/:eventId/results" element={<EventResults />} />
      </Routes>
      <Footer />
    </Suspense>
  );
}
