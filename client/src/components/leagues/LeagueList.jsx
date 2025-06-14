import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSport } from "../../context/SportsContext";

export default function LeagueList() {
  const [leagues, setLeagues] = useState([]);
  console.log('leagues: ', leagues);
  const { sport } = useSport();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/leagues?sport=${sport}`)
      .then(res => setLeagues(res.data))
      .catch(() => setLeagues([]));
  }, [sport]);

  return (
    <ul>
      {leagues.map(l => (
        <li key={l.id} onClick={() => navigate(`/leagues/${l.id}`)} style={{ cursor: "pointer", margin: "1rem 0" }}>
          {l.name}
        </li>
      ))}
    </ul>
  );
}
