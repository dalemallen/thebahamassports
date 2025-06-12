import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LeagueDetails() {
  const { id } = useParams();
  const [league, setLeague] = useState(null);

  useEffect(() => {
    axios.get(`/api/leagues/${id}`)
      .then(res => setLeague(res.data))
      .catch(() => setLeague(null));
  }, [id]);

  if (!league) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{league.name}</h1>
      <p>{league.description || "No description available."}</p>
    </div>
  );
}
