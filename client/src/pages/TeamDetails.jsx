import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/teams/${id}`)
      .then((res) => setTeam(res.data))
      .catch((err) => console.error("Error fetching team", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading team info...</p>;
  if (!team) return <p>Team not found</p>;

  return (
    <div>
      <h1>{team.name}</h1>
      <img src={team.logo_url} alt={`${team.name} logo`} />
      <p>Sport: {team.sport_name}</p>
      <p>Federation: {team.federation_name}</p>
      <h3>Players:</h3>
      <ul>
        {team.players.map((player) => (
          <li key={player.id}>{player.first_name} {player.last_name}</li>
        ))}
      </ul>
    </div>
  );
}
