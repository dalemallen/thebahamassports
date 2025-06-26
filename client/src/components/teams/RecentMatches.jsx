// RecentMatches.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const RecentMatches = ({ teamId }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/recent-matches`) 
      .then((res) => {
        const all = [...res.data.leagueMatches, ...res.data.tournamentMatches];
        setMatches(all);
      })
      .catch(console.error);
  }, [teamId]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Recent Matches</Typography>
        <List>
          {matches.map((match, idx) => (
            <ListItem key={idx}>{match.home_team_name} vs {match.away_team_name} — {match.result}</ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentMatches;