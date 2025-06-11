import { useEffect, useState } from "react";
import axios from "axios";

export default function TeamsList() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get("/api/teams")
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Teams</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <a href={`/teams/${team.id}`}>{team.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}