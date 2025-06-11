import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSport } from "../../context/SportsContext";


export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const { sport } = useSport();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tournaments?sport=${sport}`)
      .then(res => setTournaments(res.data))
      .catch(() => setTournaments([]));
  }, [sport]);

  return (
    <ul>
      {tournaments.map(t => (
        <li key={t.id} onClick={() => navigate(`/tournaments/${t.id}`)} style={{ cursor: "pointer", margin: "1rem 0" }}>
          {t.name}
        </li>
      ))}
    </ul>
  );
}
