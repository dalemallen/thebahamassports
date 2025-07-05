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
  Button,
  Stack,
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
  const [actions, setActions] = useState([]);
  console.log('actions: ', actions);
  const [loadingActions, setLoadingActions] = useState(true);

  useEffect(() => {
    if (!dbUser?.id || role !== "athlete") return;

    const fetchData = async () => {
      try {
        const [athleteRes,  actionsRes] = await Promise.all([
          axios.get(`/api/athletes/${dbUser.id}`),
          // axios.get(`/api/events/upcoming`),
          // axios.get(`/api/opportunities`),
          axios.get(`/api/users/${dbUser.id}/actions`),
        ]);
        setAthleteProfile(athleteRes.data);
        // setEvents(eventsRes.data || []);
        // setOpportunities(oppRes.data || []);
        setActions(actionsRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoadingProfile(false);
        setLoadingActions(false);
      }
    };

    fetchData();
  }, [dbUser, role]);

  const handleActionUpdate = async (actionId, status) => {
    try {
      await axios.patch(`/api/users/${dbUser.id}/actions/${actionId}`, { status });
      setActions(actions.filter((a) => a.id !== actionId)); // remove after completion/dismissal
    } catch (err) {
      console.error("Failed to update action:", err);
    }
  };

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
            {loadingActions ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : actions.length > 0 ? (
              <List dense>
                {actions.map((action) => (
                  <ListItem key={action.id} alignItems="flex-start">
                    <ListItemIcon>
                      <FolderIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography>
                          {action.title}{" "}
                          <Typography
                            component="span"
                            color="text.secondary"
                            fontSize="0.8rem"
                          >
                            ({action.priority})
                          </Typography>
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            {action.description}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            Due: {action.due_date || "N/A"}
                          </Typography>
                        </>
                      }
                    />
                    <Stack direction="column" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleActionUpdate(action.id, "completed")}
                      >
                        Complete
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleActionUpdate(action.id, "dismissed")}
                      >
                        Dismiss
                      </Button>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No pending actions.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
