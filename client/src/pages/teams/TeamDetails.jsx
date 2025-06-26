import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  Divider
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/common/BackButton";
import Roster from "../../components/common/Roster";
import PlayerCard from "../../components/common/PlayerCard"; // Optional

export default function TeamDetails() {
  const { teamId } = useParams();
  console.log('teamId: ', teamId);
  const [team, setTeam] = useState(null);
  console.log('team: ', team);
  const [players, setPlayers] = useState([]);
  console.log('players: ', players);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      try {
        const [teamRes, playerRes] = await Promise.all([
          axios.get(`/api/teams/${teamId}`),
          axios.get(`/api/teams/${teamId}/players`)
        ]);

        setTeam(teamRes.data);
        setPlayers(playerRes.data);
      } catch (err) {
        console.error("Failed to load team or players", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndPlayers();
  }, [teamId]);

  if (loading) return <Typography>Loading team details...</Typography>;
  if (!team) return <Typography>Team not found.</Typography>;

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

      <Typography variant="h5" gutterBottom>Players</Typography>

      {players.length === 0 ? (
        <Typography color="text.secondary">No players for this team.</Typography>
      ) : (
        // Option 1: Use modular Roster component (your original approach)
        <Roster
          data={players}
          title="Players"
          showNumbers
          linkToProfile
          role="player"
          emptyMessage="No players for this team."
        />

        // Option 2: Use PlayerCard (for enhanced styling)
        // players.map(player => (
        //   <PlayerCard key={player.id} player={player} />
        // ))
      )}
    </Container>
  );
}
