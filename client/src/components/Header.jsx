import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SportsFilter from "./SportsFilter";

export default function Header() {
  const location = useLocation();
  const [sport, setSport] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSport(params.get("sport") || "");
  }, [location.search]);

  const handleSportChange = (selectedSport) => {
    const params = new URLSearchParams(location.search);
    if (selectedSport) {
      params.set("sport", selectedSport);
    } else {
      params.delete("sport");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <header>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/federations">Federations</Link> |{" "}
        <Link to="/teams">Teams</Link> |{" "}
        <Link to="/players">Players</Link> |{" "}
        <Link to="/events">Events</Link>
      </nav>
      <SportsFilter sport={sport} onChange={handleSportChange} />
    </header>
  );
}