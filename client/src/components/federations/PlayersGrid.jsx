import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  CardActionArea,
  useTheme
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PlayersGrid = ({ players }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!players || players.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No players available.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        Athletes ({players.length})
      </Typography>

      <Grid container spacing={3}>
        {players.map((player) => (
          <Grid size={{xs:12, sm:6, md:4}} key={`${player.user_id}-${player.team_name}`}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6
                }
              }}
            >
              <CardActionArea onClick={() => navigate(`/players/${player.user_id}`)} sx={{ display: "flex", alignItems: "center", px: 2, py: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    fontWeight: 600,
                    fontSize: 20
                  }}
                >
                  {player.first_name?.[0]}
                  {player.last_name?.[0]}
                </Avatar>

                <CardContent sx={{ pl: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {player.first_name} {player.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {player.position || "Position TBD"}
                    {player.team_name ? ` — ${player.team_name}` : ""}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlayersGrid;
