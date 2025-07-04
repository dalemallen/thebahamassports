import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import FolderIcon from "@mui/icons-material/Folder";
import useUser from "../../hooks/useUser"; // adjust if path differs
import axios from "axios";

export default function DashboardAthlete() {
  const { role, isLoading, dbUser } = useUser();
  const [athleteProfile, setAthleteProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!dbUser?.id || role !== "athlete") return;

    const fetchAthleteProfile = async () => {
      try {
        const res = await axios.get(`/api/athletes/${dbUser.id}`);
        setAthleteProfile(res.data);
      } catch (err) {
        console.error("Failed to load athlete profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchAthleteProfile();
  }, [dbUser, role]);

  if (isLoading || !dbUser) return <CircularProgress sx={{ mt: 5 }} />;
  if (role !== "athlete") return <Typography>Unauthorized</Typography>;

  if (loadingProfile) return <CircularProgress sx={{ mt: 5 }} />;

  const athlete = athleteProfile || {
    name: dbUser.first_name || dbUser.nickname,
    position: "N/A",
    height_cm: "N/A",
    weight_kg: "N/A",
    club_team: "N/A",
  };

  const stats = athleteProfile?.stats || {
    matches: 0,
    points: 0,
    caps: 0,
    assists: 0,
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Welcome back, {athlete.name}</Typography>
          <Typography variant="subtitle1">Your Athlete Dashboard</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Quick Stats</Typography>
            <Typography>Matches Played: {stats.matches}</Typography>
            <Typography>Points Scored: {stats.points}</Typography>
            <Typography>Caps: {stats.caps}</Typography>
            <Typography>Assists: {stats.assists}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Performance</Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["Matches", "Points", "Caps", "Assists"] }]}
              series={[{ data: [stats.matches, stats.points, stats.caps, stats.assists] }]}
              width={400}
              height={200}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Upcoming Events</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Rugby League Match"
                  secondary="July 6 @ 3PM - Thomas A. Robinson Stadium"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Opportunities</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Tryouts for Bahamas Rugby U20 — Apply Now" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Upload Highlights for Scouting" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">My Teams</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary={athlete.club_team} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Actions</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="Complete Emergency Contact Form" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="Upload Passport Copy" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
