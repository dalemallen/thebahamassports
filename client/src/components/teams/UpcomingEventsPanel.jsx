// UpcomingEventsPanel.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem, CircularProgress } from "@mui/material";
import axios from "axios";

const UpcomingEventsPanel = ({ teamId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const trainings = await axios.get(`/api/teams/${teamId}/trainings`);
        const matches = await axios.get(`/api/teams/${teamId}/recent-matches`);

        const formattedTrainings = trainings.data.map(e => ({ ...e, type: "Training" }));
        const allMatches = [...matches.data.leagueMatches, ...matches.data.tournamentMatches].map(e => ({ ...e, type: "Match" }));
        const combined = [...formattedTrainings, ...allMatches].sort((a, b) => new Date(a.match_date || a.training_date) - new Date(b.match_date || b.training_date));

        setEvents(combined);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [teamId]);

  if (loading) return <CircularProgress />;
  if (!events.length) return <Typography>No upcoming events</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Upcoming Events</Typography>
        <List>
          {events.map((event, idx) => (
            <ListItem key={idx}>
              {event.type}: {event.title || event.focus || "Unnamed"} — {event.match_date || event.training_date}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsPanel;