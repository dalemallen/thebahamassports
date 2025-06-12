import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await axios.get(`/api/teams/${id}`);
        setTeam(data.team);
        setPlayers(data.players);
      } catch (err) {
        console.error("Failed to load team details", err);
      }
    };

    fetchTeam();
  }, [id]);

  if (!team) return <Typography>Loading team details...</Typography>;

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        {team.name}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        League: {team.league_id} | Bracket: {team.bracket_id}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5" gutterBottom>
        Players
      </Typography>

      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid key={player.id} item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Avatar sx={{ mb: 1 }}>{player.first_name[0]}</Avatar>
                <Typography variant="body1">
                  {player.first_name} {player.last_name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
