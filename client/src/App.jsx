import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "./context/AuthContext";
import PageLoader from "./components/PageLoader.jsx";
import LayoutSwitcher from "./layouts/LayoutSwitcher.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
// Layouts & Core Pages
const Headers = lazy(() => import("./components/common/Header.jsx"));
const Footer = lazy(() => import("./components/common/Footer.jsx"));
const Home = lazy(() => import("./pages/home/Home.jsx"));
const Pricing = lazy(() => import("./pages/pricing/Pricing.jsx"));
const Unauthorized = lazy(() => import("./pages/Unauthorized.jsx"));
const RedirectHandler = lazy(() => import("./components/auth/RedirectHandler.jsx"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute.jsx"));
const Onboard = lazy(() => import("./pages/onboard/Onboard.jsx"));


// Feature Pages
const FederationDetails = lazy(() => import("./pages/federations/FederationDetails.jsx"));
const LeaguesPage = lazy(() => import("./pages/leagues/LeaguesPage.jsx"));
const LeagueDetails = lazy(() => import("./pages/leagues/LeagueDetails.jsx"));
const TournamentsPage = lazy(() => import("./pages/tournaments/TournamentsPage.jsx"));
const TournamentDetails = lazy(() => import("./pages/tournaments/TournamentDetails.jsx"));
const TeamsPage = lazy(() => import("./pages/teams/TeamsPage.jsx"));
const TeamDetails = lazy(() => import("./pages/teams/TeamDetails.jsx"));
const TeamPlayers = lazy(() => import("./components/teams/TeamPlayers.jsx"));
const AthletesList = lazy(() => import("./components/athletes/AthletesList.jsx"));
const AthleteDirectory = lazy(() => import("./pages/athletes/AthleteDirectory.jsx"));
const AthleteDetails = lazy(() => import("./pages/athletes/AthleteDetails.jsx"));
const EventLists = lazy(() => import("./components/events/EventLists.jsx"));
const EventDetails = lazy(() => import("./pages/events/EventDetails.jsx"));
const EventTeams = lazy(() => import("./components/events/EventTeams.jsx"));
const EventResults = lazy(() => import("./components/events/EventResults.jsx"));
const SchedulePage = lazy(() => import("./pages/schedules/SchedulePage.jsx"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.jsx"));
const Contact = lazy(() => import("./pages/contact/Contact.jsx"));

export default function App() {
  const { user, isAuthenticated } = useAuth0();
  const userRole = user?.["https://thebahamassports.com/roles"]?.[0];
  const onboardingComplete = user?.onboarding_complete;

    const { isLoading: auth0Loading } = useAuth0();
  const { isLoading: userLoading, dbUser } = useUser(); // your AuthContext

  const isLoading = auth0Loading || userLoading;

  if (isLoading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
<LayoutSwitcher>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<RedirectHandler />} />
        <Route path="/redirect-handler" element={<RedirectHandler />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboard/:role" element={<Onboard />} />
         <Route path="/contact" element={<Contact />} />

 <Route
  path="/dashboard/:role"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/aboutus" element={<AboutUsPage />} />
    
        {/* Feature Pages */}
        <Route path="/sports/:sportId" element={<FederationDetails />} />
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/leagues/:leagueId" element={<LeagueDetails />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:tournamentId" element={<TournamentDetails />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:teamId" element={<TeamDetails />} />
        <Route path="/teams/:teamId/athletes" element={<TeamPlayers />} />
        <Route path="/teams/:teamId/athlete/:athleteId" element={<AthleteDetails />} />
        <Route path="/athletes" element={<AthleteDirectory />} />
        <Route path="/athletes/:athleteId" element={<AthleteDetails />} />
        <Route path="/events" element={<EventLists />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:eventId/teams" element={<EventTeams />} />
        <Route path="/events/:eventId/results" element={<EventResults />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/schedule/:federationId" element={<EventResults />} />
        <Route path="/schedule/:userId" element={<EventResults />} />
      </Routes>
</LayoutSwitcher>
    </Suspense>
  );
}
