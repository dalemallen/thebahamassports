import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LeagueDetails() {
  const { leagueId } = useParams();
  const [league, setLeague] = useState(null);

  useEffect(() => {
    axios.get(`/api/leagues/${leagueId}`)
      .then(res => setLeague(res.data))
      .catch(() => setLeague(null));
  }, [leagueId]);

  if (!league) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{league.name}</h1>
      <p>{league.description || "No description available."}</p>
    </div>
  );
}
