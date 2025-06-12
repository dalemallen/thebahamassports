import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TournamentDetails() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    axios.get(`/api/tournaments/${id}`)
      .then(res => setTournament(res.data))
      .catch(() => setTournament(null));
  }, [id]);

  if (!tournament) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{tournament.name}</h1>
      <p>{tournament.description || "No description available."}</p>
    </div>
  );
}
