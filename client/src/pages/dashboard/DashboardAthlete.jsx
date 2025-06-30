import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Divider,
  useTheme,
  Container,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function DashboardAthlete() {
    const { role, isLoading, dbUser } = useUser();

  if (isLoading || !dbUser) return <div>Loading...</div>; // or a spinner

  if (role !== "athlete") return <div>Unauthorized</div>; // optional
  const theme = useTheme();

  const athlete = {
    name: 'Andrew Thompsen',
    birthdate: 'March 15, 2005',
    position: 'Fly-Half',
    height_cm: 180,
    weight_kg: 61,
    club_team: 'Nassau Rugby Club',
    profile_photo_url: ''
  };

  const stats = {
    matches: 24,
    tries: 8,
    conversions: 15,
    tackles: 102,
    cards: 4,
    lineBreaks: 22
  };

  const matchHistory = [
    {
      opponent: 'Canada',
      date: 'Jun 25',
      result: 'W',
      role: 'Starter',
      stats: '0 T, 3 C'
    },
    {
      opponent: 'USA U20',
      date: 'Jun 16',
      result: 'W',
      role: 'Starter',
      stats: '2 T, 0 C'
    },
    {
      opponent: 'Cayman Islands',
      date: 'Jun 5',
      result: 'W',
      role: 'Starter',
      stats: '1 T, 1 C'
    }
  ];

  const radarData = [
    { subject: 'Passing', A: 70 },
    { subject: 'Kicking', A: 85 },
    { subject: 'Defense', A: 65 },
    { subject: 'Vision', A: 50 },
    { subject: 'Speed', A: 80 },
    { subject: 'Agility', A: 60 }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {athlete.name} 🇧🇸
          </Typography>
          <Typography variant="subtitle1">Rugby • Last login: 6/23/2025</Typography>
        </Grid>

        <Grid item size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Quick Stats</Typography>
            <Typography>Matches Played: 0</Typography>
            <Typography>Points Scored: 0</Typography>
            <Typography>Caps: 0</Typography>
            <Typography>Assists: 0</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Performance Overview</Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['Matches', 'Points', 'Caps', 'Assists'] }]}
              series={[{ data: [0, 0, 0, 0], label: 'Season Stats' }]}
              width={400}
              height={200}
            />
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Upcoming Events</Typography>
            <List>
              <ListItem>
                <ListItemIcon><EventIcon /></ListItemIcon>
                <ListItemText primary="Rugby League Match — July 6 @ 3PM" secondary="Thomas A. Robinson Stadium" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Opportunities</Typography>
            <List>
              <ListItem>
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="Tryouts for Bahamas Rugby U20 — Apply Now" />
              </ListItem>
              <ListItem>
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="Upload Highlights for Scouting" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Physical Metrics</Typography>
            <Typography>Height: cm</Typography>
            <Typography>Weight: kg</Typography>
            <Typography>Position:</Typography>
            <Typography>Preferred Side:</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">My Teams</Typography>
            <List>
              <ListItem>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary="Nassau Rugby Club" />
              </ListItem>
              <ListItem>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary="Bahamas U18 National Team" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Federation Status</Typography>
            <Typography>✅ Registered with Bahamas Rugby Union</Typography>
            <Typography>🪪 ID Verification: Pending</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Documents</Typography>
            <Typography>✅ Medical Form — Submitted</Typography>
            <Typography>❌ Passport Upload — Missing</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Athlete Bio</Typography>
            <Typography>Nationality: Bahamas</Typography>
            <Typography>Years Active: 3</Typography>
            <Typography>Email: dale.m.allen@hotmail.com</Typography>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Actions</Typography>
            <List>
              <ListItem>
                <ListItemIcon><FolderIcon /></ListItemIcon>
                <ListItemText primary="Complete Emergency Contact Form" />
              </ListItem>
              <ListItem>
                <ListItemIcon><FolderIcon /></ListItemIcon>
                <ListItemText primary="Upload Passport Copy" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
