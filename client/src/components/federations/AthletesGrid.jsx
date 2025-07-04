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

const AthletesGrid = ({ athletes }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!athletes || athletes.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No athletes available.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 3 }}>
        Athletes ({athletes.length})
      </Typography>

      <Grid container spacing={3}>
        {athletes.map((athlete) => (
          <Grid size={{xs:12, sm:6, md:4}} key={`${athlete.user_id}-${athlete.team_name}`}>
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
              <CardActionArea onClick={() => navigate(`/athletes/${athlete.user_id}`)} sx={{ display: "flex", alignItems: "center", px: 2, py: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    fontWeight: 600,
                    fontSize: 20
                  }}
                >
                  {athlete.first_name?.[0]}
                  {athlete.last_name?.[0]}
                </Avatar>

                <CardContent sx={{ pl: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {athlete.first_name} {athlete.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {athlete.position || "Position TBD"}
                    {athlete.team_name ? ` — ${athlete.team_name}` : ""}
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

export default AthletesGrid;
