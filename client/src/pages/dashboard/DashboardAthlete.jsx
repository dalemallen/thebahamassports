// 📁 DashboardAthlete.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts';

const DashboardAthlete = () => {
  const { user, isAuthenticated } = useAuth0();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/athletes/profile?auth0_id=${user.sub}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching athlete profile:', err);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  if (!profile) return <Typography>Loading dashboard...</Typography>;

  const stats = {
    matches: profile.matches_played || 0,
    points: profile.points || 0,
    caps: profile.caps || 0,
    assists: profile.assists || 0,
    tries: profile.tries || 0,
    yellow_cards: profile.yellow_cards || 0,
    red_cards: profile.red_cards || 0,
  };

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome back, {profile.first_name || 'Athlete'} {profile.last_name || ''} 🇷🇸
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Rugby • Last login: {new Date().toLocaleDateString()}
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Quick Stats</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>Matches Played: {stats.matches}</Typography>
            <Typography>Points Scored: {stats.points}</Typography>
            <Typography>Caps: {stats.caps}</Typography>
            <Typography>Assists: {stats.assists}</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Performance Overview</Typography>
            <Divider sx={{ my: 1 }} />
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['Matches', 'Points', 'Caps', 'Assists'] }]}
              series={[{ data: [stats.matches, stats.points, stats.caps, stats.assists], label: 'Season Stats' }]}
              width={400}
              height={200}
            />
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Upcoming Events</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>🏉 Rugby League Match — July 6 @ 3PM</Typography>
            <Typography>📍 Thomas A. Robinson Stadium</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Opportunities</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>📝 Tryouts for Bahamas Rugby U20 — Apply Now</Typography>
            <Typography>📹 Upload Highlights for Scouting</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Physical Metrics</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>Height: {profile.height_cm} cm</Typography>
            <Typography>Weight: {profile.weight_kg} kg</Typography>
            <Typography>Position: {profile.position}</Typography>
            <Typography>Preferred Side: {profile.preferred_side}</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">My Teams</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>🏉 Nassau Rugby Club</Typography>
            <Typography>🏅 Bahamas U18 National Team</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Federation Status</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>✅ Registered with Bahamas Rugby Union</Typography>
            <Typography>🔐 ID Verification: Pending</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Documents</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>✅ Medical Form — Submitted</Typography>
            <Typography>❌ Passport Upload — Missing</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Athlete Bio</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>Nationality: Bahamas</Typography>
            <Typography>Years Active: 3</Typography>
            <Typography>Email: {user?.email}</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Actions</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>📄 Complete Emergency Contact Form</Typography>
            <Typography>📁 Upload Passport Copy</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAthlete;
