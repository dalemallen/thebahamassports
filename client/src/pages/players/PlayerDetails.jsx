import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Avatar,
  Divider,
  Box,
  Paper,
  Skeleton,
} from "@mui/material";
import axios from "axios";
import BackButton from "../../components/common/BackButton";

export default function PlayerDetails() {
  const { playerId } = useParams();
  console.log('playerId: ', playerId);
  const [player, setPlayer] = useState(null);
  console.log('player: ', player);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/players/${playerId}`)
      .then(res => {
        setPlayer(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching player:", err);
        setLoading(false);
      });
  }, [playerId]);

  if (loading || !player) {
    return (
      <Container sx={{ p: 4 }}>
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton height={40} width="60%" />
        <Skeleton height={20} width="40%" />
      </Container>
    );
  }

  const {
    first_name,
    last_name,
    profile_photo_url,
    position,
    jersey_number,
    height_cm,
    weight_kg,
    birthdate,
    birthplace,
    debut_year,
    caps,
    points,
    club_team,
    achievements,
  } = player;

  return (
    <Container sx={{ p: 4 }}>
      <BackButton fallback="/players" label="Back to Players" />

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar
          src={profile_photo_url || ""}
          alt={`${first_name} ${last_name}`}
          sx={{ width: 120, height: 120, margin: "auto", mb: 2 }}
        >
          {first_name?.[0]}
        </Avatar>
        <Typography variant="h4">
          {first_name} {last_name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          #{jersey_number} | {Array.isArray(position) ? position.join(", ") : position}
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Height:</strong> {height_cm ? `${height_cm} cm` : "—"}</Typography>
          </Grid>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Weight:</strong> {weight_kg ? `${weight_kg} kg` : "—"}</Typography>
          </Grid>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Birthdate:</strong> {birthdate || "—"}</Typography>
          </Grid>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Birthplace:</strong> {birthplace || "—"}</Typography>
          </Grid>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Debut Year:</strong> {debut_year || "—"}</Typography>
          </Grid>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Club:</strong> {club_team || "—"}</Typography>
          </Grid>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Caps:</strong> {caps ?? "0"}</Typography>
          </Grid>
          <Grid item size={{ xs:6 }}>
            <Typography variant="body1"><strong>Points:</strong> {points ?? "0"}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {achievements && (
        <>
          <Typography variant="h6" gutterBottom>Achievements</Typography>
          <Typography variant="body1">{achievements}</Typography>
        </>
      )}
    </Container>
  );
}
