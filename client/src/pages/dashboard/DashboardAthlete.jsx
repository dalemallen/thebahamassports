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
import { useUser } from "../../context/AuthContext";
import axios from "axios";
import { useTheme } from "@mui/material";

export default function DashboardAthlete() {
  const { role, isLoading, dbUser } = useUser();
  const theme = useTheme();

  const [athleteProfile, setAthleteProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [events, setEvents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    if (!dbUser?.id || role !== "athlete") return;

    const fetchData = async () => {
      try {
        const [athleteRes, eventsRes, oppRes] = await Promise.all([
          axios.get(`/api/athletes/${dbUser.id}`),
          axios.get(`/api/events/upcoming`),
          axios.get(`/api/opportunities`),
        ]);
        setAthleteProfile(athleteRes.data);
        setEvents(eventsRes.data || []);
        setOpportunities(oppRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchData();
  }, [dbUser, role]);

  if (isLoading || !dbUser) return <CircularProgress sx={{ mt: 5 }} />;
  if (role !== "athlete") return <Typography>Unauthorized</Typography>;
  if (loadingProfile) return <CircularProgress sx={{ mt: 5 }} />;

  const athlete = athleteProfile || {
    name: dbUser.first_name || dbUser.nickname,
    position: "N/A",
    height_cm: "N/A",
    weight_kg: "N/A",
    club_team: null,
  };

  const stats = athleteProfile?.stats_json || {
    matches: 0,
    points: 0,
    caps: 0,
    assists: 0,
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Welcome back, <strong>{athlete.name}</strong>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your Athlete Dashboard
          </Typography>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderTop: `4px solid ${theme.palette.primary.main}` }}>
            <Typography variant="h6" color="primary">
              Quick Stats
            </Typography>
            <Typography>Matches Played: {stats.matches}</Typography>
            <Typography>Points Scored: {stats.points}</Typography>
            <Typography>Caps: {stats.caps}</Typography>
            <Typography>Assists: {stats.assists}</Typography>
          </Paper>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              Performance
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: ["Matches", "Points", "Caps", "Assists"] }]}
              series={[{ data: [stats.matches, stats.points, stats.caps, stats.assists] }]}
              width={500}
              height={200}
            />
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              Upcoming Events
            </Typography>
            <List dense>
              {events.length > 0 ? (
                events.map((e) => (
                  <ListItem key={e.id}>
                    <ListItemIcon>
                      <EventIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={e.title}
                      secondary={`${e.start_date} - ${e.location}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming events.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Opportunities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              Opportunities
            </Typography>
            <List dense>
              {opportunities.length > 0 ? (
                opportunities.map((o) => (
                  <ListItem key={o.id}>
                    <ListItemIcon>
                      <AssignmentIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary={o.title} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No current opportunities.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* My Teams */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              My Teams
            </Typography>
            <List dense>
              {athlete.club_team ? (
                <ListItem>
                  <ListItemIcon>
                    <GroupIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary={athlete.club_team} />
                </ListItem>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  You are not yet part of a team.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Pending Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              Pending Actions
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <FolderIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="Complete Emergency Contact Form" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FolderIcon color="secondary" />
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
