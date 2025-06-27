import { lazy, Suspense } from "react";
import { useUser } from "../../context/AuthContext";
import PageLoader from "../../components/PageLoader.jsx";
// import Sidebar from "../../components/common/Sidebar.jsx";

// Lazy load all role dashboards
const DashboardAthlete = lazy(() => import("./DashboardAthlete.jsx"));
const DashboardCoach = lazy(() => import("./DashboardCoach.jsx"));
const DashboardFederation = lazy(() => import("./DashboardFederation.jsx"));
const DashboardOrganizer = lazy(() => import("./DashboardOrganizer.jsx"));
const DashboardTeam = lazy(() => import("./DashboardTeam.jsx"));
const DashboardParent = lazy(() => import("./DashboardParent.jsx"));
const DashboardSponsor = lazy(() => import("./DashboardSponsor.jsx"));
const DashboardScout = lazy(() => import("./DashboardScout.jsx"));

export default function Dashboard() {
  const { role, dbUser } = useUser();
  console.log('dbUser: ', dbUser);

  if (!role || !dbUser) return <PageLoader />;

  const renderDashboard = () => {
    switch (role) {
      case "athlete":
        return <DashboardAthlete />;
      case "coach":
        return <DashboardCoach />;
      case "federation":
        return <DashboardFederation />;
      case "organizer":
        return <DashboardOrganizer />;
      case "team":
        return (
          <DashboardTeam
            teamId={dbUser?.team_id}
            team={dbUser?.team}
            userId={dbUser?.id}
          />
        );
      case "parent":
        return <DashboardParent />;
      case "sponsor":
        return <DashboardSponsor />;
      case "scout":
        return <DashboardScout />;
      default:
        return <div>Unknown role: {role}</div>;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* <Sidebar role={role} /> */}
      <main style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>{renderDashboard()}</Suspense>
      </main>
    </div>
  );
}
