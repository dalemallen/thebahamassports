import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Box,
  useTheme,
} from "@mui/material";
import axios from "axios";

const TeamsGrid = ({ federationId }) => {
  const [teams, setTeams] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`/api/federations/${federationId}/teams`);
        setTeams(res.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, [federationId]);

  if (!teams.length) {
    return (
      <Typography variant="body1" color="text.secondary">
        No registered teams found.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        Registered Teams ({teams.length})
      </Typography>

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid size={{xs:12, sm:6, md:4}} key={team.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={team.logo_url}
                  alt={team.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {team.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {team.division || "No Division"} •{" "}
                    {team.wins ?? 0}W - {team.losses ?? 0}L
                  </Typography>
                </CardContent>
              </Box>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  href={`/teams/${team.id}`}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeamsGrid;
