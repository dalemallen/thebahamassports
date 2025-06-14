import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  Divider
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/common/BackButton";
import Roster from "../../components/common/Roster";  // Modular Roster Component

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await axios.get(`/api/teams/${id}`);
        setTeam(data);
      } catch (err) {
        console.error("Failed to load team details", err);
      }
    };

    fetchTeam();
  }, [id]);

  if (!team) return <Typography>Loading team details...</Typography>;

  return (
    <Container sx={{ p: 4 }}>
      <BackButton fallback="/teams" label="Back to Teams" />

      <Typography variant="h4" gutterBottom>
        {team.name}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        League: {team.league_id || "N/A"} | Bracket: {team.bracket_id || "N/A"}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Roster
        data={team.players || []}
        title="Players"
        showNumbers
        linkToProfile
        role="player"
        emptyMessage="No players for this team."
      />
    </Container>
  );
}
