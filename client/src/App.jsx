import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PageLoader from "./components/PageLoader.jsx";
// Lazy load all pages and components
const Home = lazy(() => import("./pages/Home.jsx"));
const RedirectHandler = lazy(() => import("./components/RedirectHandler.jsx"));
const Unauthorized = lazy(() => import("./pages/Unauthorized.jsx"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute.jsx"));

const SportsList = lazy(() => import("./pages/SportsList"));
const SportDetail = lazy(() => import("./pages/SportDetail"));
const FederationsList = lazy(() => import("./pages/FederationsList"));
const FederationDetail = lazy(() => import("./pages/FederationDetail"));
const TeamsList = lazy(() => import("./pages/TeamsList"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const TeamPlayers = lazy(() => import("./pages/TeamPlayers"));
const PlayerDetail = lazy(() => import("./pages/PlayerDetail"));
const PlayersList = lazy(() => import("./pages/PlayersList"));
const EventsList = lazy(() => import("./pages/EventsList"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const EventTeams = lazy(() => import("./pages/EventTeams"));
const EventResults = lazy(() => import("./pages/EventResults"));

const DashboardAthlete = lazy(() => import("./pages/DashboardAthlete"));
const DashboardCoach = lazy(() => import("./pages/DashboardCoach"));
const DashboardFederation = lazy(() => import("./pages/DashboardFederation"));
const DashboardOrganizer = lazy(() => import("./pages/DashboardOrganizer"));
const DashboardTeam = lazy(() => import("./pages/DashboardTeam"));
const DashboardParent = lazy(() => import("./pages/DashboardParent"));
const DashboardSponsor = lazy(() => import("./pages/DashboardSponsor"));
const DashboardScout = lazy(() => import("./pages/DashboardScout"));
const Headers = lazy(() => import("./components/Header.jsx"));

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
        <Route path="/sports/:sportId" element={<SportDetail />} />

        {/* Federations */}
        <Route path="/federations" element={<FederationsList />} />
        <Route path="/federations/:federationId" element={<FederationDetail />} />

        {/* Teams */}
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />
        <Route path="/teams/:teamId/players" element={<TeamPlayers />} />
        <Route path="/teams/:teamId/player/:playerId" element={<PlayerDetail />} />

        {/* Players */}
        <Route path="/players" element={<PlayersList />} />
        <Route path="/players/:playerId" element={<PlayerDetail />} />

        {/* Events */}
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/events/:eventId/teams" element={<EventTeams />} />
        <Route path="/events/:eventId/results" element={<EventResults />} />
      </Routes>


    </Suspense>
  );
}
