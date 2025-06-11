
// src/pages/LeaguesPage.jsx
import { useEffect, useState } from "react";
import { useSport } from "../../context/SportsContext";
import axios from "axios";

export default function LeaguesPage() {
  const { sport } = useSport();
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    axios.get(`/api/leagues?sport=${sport}`)
      .then(res => setLeagues(res.data))
      .catch(() => setLeagues([{ id: 1, name: "Placeholder League" }]));
  }, [sport]);

  return (
    <div>
      <h1>{sport.charAt(0).toUpperCase() + sport.slice(1)} League</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      {leagues.map(league => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </div>
  );
}

function LeagueCard({ league }) {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios.get(`/api/leagues/${league.id}/teams`).then(res => setTeams(res.data))
      .catch(() => setTeams([{ id: 1, name: "Team A" }, { id: 2, name: "Team B" }]));
    axios.get(`/api/leagues/${league.id}/matches`).then(res => setMatches(res.data))
      .catch(() => setMatches([{ id: 1, home: "Team A", away: "Team B", date: "TBD" }]));
  }, [league.id]);

  return (
    <div>
      <h2>{league.name}</h2>
      <section>
        <h3>Teams</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          {teams.map(team => (
            <div key={team.id} style={{ width: 120, height: 120, background: "#eee" }}>{team.name}</div>
          ))}
        </div>
      </section>

      <section>
        <h3>Upcoming Matches</h3>
        {matches.map(match => (
          <div key={match.id} style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.5rem 0" }}>
            {match.home} vs {match.away} — {match.date}
          </div>
        ))}
      </section>

      <section>
        <h3>Standings</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><th>Team</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index}>
                <td>{team.name}</td><td>0</td><td>0</td><td>0</td><td>0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
