
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSport } from "../../context/SportsContext";

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  console.log('teams: ', teams);
  const { sport } = useSport();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/teams?sport=${sport}`)
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));
  }, [sport]);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {teams.map((team) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={team.id}>
          <Card onClick={() => navigate(`/teams/${team.id}`)} sx={{ cursor: "pointer" }}>
            <CardContent>
              <Avatar src={team.logo_url} sx={{ width: 56, height: 56, mb: 1 }} />
              <Typography variant="h6">{team.name}</Typography>
              <Typography variant="body2">Federation: {team.federation_name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
