import {
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSport } from "../../context/SportsContext";

export default function TeamsList() {
  const navigate = useNavigate();
  const { sport } = useSport();
  const [teams, setTeams] = useState([]);
  console.log('teams: ', teams);
  const [search, setSearch] = useState("");
  const [federation, setFederation] = useState("all");
  const [federations, setFederations] = useState([]);

  useEffect(() => {
    const fetchFederations = async () => {
      try {
        const { data } = await axios.get(`/api/federations?sport=${sport}`);
        setFederations(data);
      } catch (err) {
        console.error("Error loading federations", err);
      }
    };

    const fetchTeams = async () => {
      try {
        const url = federation !== "all"
          ? `/api/teams?sport=${sport}&federation=${federation}`
          : `/api/teams?sport=${sport}`;
        const { data } = await axios.get(url);
        setTeams(data);
      } catch (err) {
        console.error("Error loading teams", err);
      }
    };

    fetchFederations();
    fetchTeams();
  }, [sport, federation]);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Teams
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Search teams"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            label="Filter by Federation"
            value={federation}
            onChange={(e) => setFederation(e.target.value)}
          >
            <MenuItem value="all">All Federations</MenuItem>
            {federations.map((fed) => (
              <MenuItem key={fed.id} value={fed.id}>
                {fed.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredTeams.map((team) => (
          <Grid key={team.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              onClick={() => navigate(`/teams/${team.id}`)}
              sx={{ cursor: "pointer" }}
            >
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Federation: {team.federation_name || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
