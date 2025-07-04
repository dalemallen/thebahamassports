import { NavLink } from 'react-router-dom';
import logo from '../../assets/icon.png';
import { Grid } from "@mui/material";



export default function Sidebar({ role }) {
  console.log('role: ', role);

  const navItemsByRole = {
  athlete: [
    { label: 'Dashboard', path: `/dashboard/${role}` },
    { label: 'My Sports', path: '/sports' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Stats', path: '/stats' },
    { label: 'Opportunities', path: '/opportunities' },
  ],
  coach: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Team', path: '/teams' },
    { label: 'Roster', path: '/athletes' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Stats', path: '/stats' },
  ],
federation: [
  { label: 'Home', path: '/dashboard/federation' },  
  { label: 'Registration', path: '/registration' },
  { label: 'Members', path: '/federation/members' },  
  { label: 'Events', path: '/federation/events' },  
  { label: 'Tournaments', path: '/federation/tournaments' },  
  { label: 'Leagues', path: '/federation/leagues' },  
  { label: 'Approvals', path: '/federation/approvals' },  
  { label: 'Clubs', path: '/federation/clubs' },  
  { label: 'Reports', path: '/federation/reports' },  
  { label: 'Settings', path: '/federation/settings' }
],

  organizer: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tournaments', path: '/tournaments' },
    { label: 'Leagues', path: '/leagues' },
    { label: 'Manage Events', path: '/events' },
  ],
};
    const tempRole = 'athlete'; 
  const navItems = navItemsByRole[role] || [];




  return (
    <aside style={{ width: 240, background: '#023e8a', color: 'white', padding: '1rem' }}>
      <Grid container justifyContent="center">
        <img src={logo} alt="The Bahamas Sports" style={{ height: 120, marginBottom: '2rem' }} />
      </Grid>
      
      <nav>
        {navItems.map(({ label, path }) => (
          <NavLink
            to={path}
            key={label}
            style={({ isActive }) => ({
              display: 'block',
              padding: '0.5rem 1rem',
              marginBottom: '0.5rem',
              backgroundColor: isActive ? '#0077b6' : 'transparent',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: isActive ? 'bold' : 'normal'
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
