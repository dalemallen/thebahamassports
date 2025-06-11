import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    axios.get(`/api/teams/${teamId}`)
      .then(res => setTeam(res.data))
      .catch(err => console.error(err));
  }, [teamId]);

  if (!team) return <div>Loading team...</div>;

  return (
    <div>
      <h2>{team.name}</h2>
      <p>{team.description}</p>
    </div>
  );
}