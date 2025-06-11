import { useEffect, useState } from "react";
import axios from "axios";
import { useSport } from "../../context/SportsContext";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TeamsList() {
  const { sport } = useSport();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [federationFilter, setFederationFilter] = useState("");
  const [federations, setFederations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await axios.get(`/api/teams?sport=${sport}`);
        setTeams(response.data);
        setFilteredTeams(response.data);
        const uniqueFeds = [...new Set(response.data.map((team) => team.federation_name))];
        setFederations(uniqueFeds);
      } catch (err) {
        console.error("Error fetching teams", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, [sport]);

  useEffect(() => {
    if (federationFilter) {
      setFilteredTeams(teams.filter((t) => t.federation_name === federationFilter));
    } else {
      setFilteredTeams(teams);
    }
  }, [federationFilter, teams]);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <TextField
        select
        label="Filter by Federation"
        value={federationFilter}
        onChange={(e) => setFederationFilter(e.target.value)}
        sx={{ mb: 3 }}
        fullWidth
      >
        <MenuItem value="">All</MenuItem>
        {federations.map((fed, i) => (
          <MenuItem key={i} value={fed}>
            {fed}
          </MenuItem>
        ))}
      </TextField>
      <Grid container spacing={2}>
        {filteredTeams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card onClick={() => navigate(`/teams/${team.id}`)} sx={{ cursor: "pointer" }}>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Typography variant="body2">{team.federation_name}</Typography>
                {team.logo_url && (
                  <img src={team.logo_url} alt={team.name} width={60} height={60} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
