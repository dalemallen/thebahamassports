// TeamSchedule.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const TeamSchedule = ({ teamId }) => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/schedule`) 
      .then((res) => {
        const combined = [
          ...res.data.trainings.map((item) => ({ ...item, type: "Training", date: item.training_date })),
          ...res.data.leagueMatches.map((item) => ({ ...item, type: "League Match", date: item.match_date })),
          ...res.data.tournamentMatches.map((item) => ({ ...item, type: "Tournament Match", date: item.match_date })),
        ];
        setSchedule(combined);
      })
      .catch(console.error);
  }, [teamId]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Team Schedule</Typography>
        <List>
          {schedule.map((event, idx) => (
            <ListItem key={idx}>
              {event.type}: {event.location || "TBD"} — {event.date}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TeamSchedule;