import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PageLoader from "./components/PageLoader.jsx";
// Lazy load all pages and components
const Home = lazy(() => import("./pages/Home.jsx"));
const RedirectHandler = lazy(() => import("./components/auth/RedirectHandler.jsx"));
const Unauthorized = lazy(() => import("./pages/Unauthorized.jsx"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute.jsx"));

const SportsList = lazy(() => import("./components/sports/SportsList.jsx"));
const SportsDetails = lazy(() => import("./pages/SportsDetails"));
const FederationsList = lazy(() => import("./components/federations/FederationsList.jsx"));
const FederationDetails = lazy(() => import("./pages/FederationDetails"));
const TeamsList = lazy(() => import("./components/teams/TeamsList.jsx"));
const TeamDetails = lazy(() => import("./pages/TeamDetails"));
const TeamPlayers = lazy(() => import("./components/teams/TeamPlayers.jsx"));
const PlayerDetails = lazy(() => import("./pages/PlayerDetails"));
const PlayersList = lazy(() => import("./components/players/PlayersList.jsx"));
const EventLists = lazy(() => import("./components/events/EventLists.jsx"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const EventTeams = lazy(() => import("./components/events/EventTeams.jsx"));
const EventResults = lazy(() => import("./components/events/EventResults.jsx"));
const LeaguesPage = lazy(() => import("./components/leagues/LeaguesPage.jsx"));
const LeagueDetails = lazy(() => import("./pages/LeagueDetails.jsx"));
const TournamentsPage = lazy(() => import("./pages/TournamentsPage.jsx"));
const TournamentDetails = lazy(() => import("./components/tournaments/TournamentDetails.jsx"));

const DashboardAthlete = lazy(() => import("./pages/DashboardAthlete.jsx"));
const DashboardCoach = lazy(() => import("./pages/DashboardCoach.jsx"));
const DashboardFederation = lazy(() => import("./pages/DashboardFederation.jsx"));
const DashboardOrganizer = lazy(() => import("./pages/DashboardOrganizer.jsx"));
const DashboardTeam = lazy(() => import("./pages/DashboardTeam.jsx"));
const DashboardParent = lazy(() => import("./pages/DashboardParent.jsx"));
const DashboardSponsor = lazy(() => import("./pages/DashboardSponsor.jsx"));
const DashboardScout = lazy(() => import("./pages/DashboardScout.jsx"));
const Headers = lazy(() => import("./components/common/Header.jsx"));

export default function App() {
  return (


<Suspense fallback={<PageLoader />}>
<Headers/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<RedirectHandler />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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
        {/* Sports */}
        <Route path="/sports" element={<SportsList />} />
        <Route path="/sports/:sportId" element={<SportsDetails />} />

       {/* Public Leagues & Tournaments Routes */}
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/leagues/:id" element={<LeagueDetails />} />

        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetails />} />


        {/* Federations */}
        <Route path="/federations" element={<FederationsList />} />
        <Route path="/federations/:federationId" element={<FederationDetails />} />

        {/* Teams */}
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/teams/teamId" element={<TeamDetails />} />
        <Route path="/teams/:teamId/players" element={<TeamPlayers />} />
        <Route path="/teams/:teamId/player/:playerId" element={<PlayerDetails />} />

        {/* Players */}
        <Route path="/players" element={<PlayersList />} />
        <Route path="/players/:id" element={<PlayerDetails />} />

        {/* Events */}
        <Route path="/events" element={<EventLists />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:eventId/teams" element={<EventTeams />} />
        <Route path="/events/:eventId/results" element={<EventResults />} />
      </Routes>

    </Suspense>
  );
}
