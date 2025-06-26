// TeamAnnouncements.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const TeamAnnouncements = ({ teamId }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios.get(`/api/announcements/team/${teamId}`)
      .then((res) => setAnnouncements(res.data))
      .catch(console.error);
  }, [teamId]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Announcements</Typography>
        <List>
          {announcements.map((a, i) => (
            <ListItem key={i}>{a.title} — {a.message}</ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TeamAnnouncements;