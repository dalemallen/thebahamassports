import Sidebar from '../../components/common/Sidebar';
import DashboardAthlete from './DashboardAthlete';


export default function Dashboard({ userRole }) {
    console.log('userRole: ', userRole);
    const testRole = 'athlete';
  const renderDashboard = () => {
    switch (testRole) {
      case 'athlete': return <DashboardAthlete />;
    //   case 'coach': return <DashboardCoach />;
    //   case 'federation': return <DashboardFederation />;
    //   case 'organizer': return <DashboardOrganizer />;
    //   case 'team': return <DashboardTeam />;
      default: return <div>Unknown role</div>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role={userRole} />
      <main style={{ flex: 1 }}>

        {renderDashboard()}
      </main>
    </div>
  );
}
