import React from "react";
import {
  Box, Grid, Typography, Card, CardContent, useTheme
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WebIcon from "@mui/icons-material/Web";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";

const featureData = [
  {
    title: "Registration & Payment",
    description: "Collect registrations and fees with flexible forms and payment options.",
    icon: <PersonIcon fontSize="large" color="primary" />,
  },
  {
    title: "Scheduling",
    description: "Plan balanced, conflict-free schedules for practices, games, and events.",
    icon: <ScheduleIcon fontSize="large" color="primary" />,
  },
  {
    title: "Website Builder",
    description: "Create a professional presence for your team or event with no coding required.",
    icon: <WebIcon fontSize="large" color="primary" />,
  },
  {
    title: "Fundraising",
    description: "Boost your program with built-in donation tools and sponsor management.",
    icon: <VolunteerActivismIcon fontSize="large" color="primary" />,
  },
  {
    title: "Athlete Profiles",
    description: "Scouting-ready profiles with stats, achievements, and media highlights.",
    icon: <StarIcon fontSize="large" color="primary" />,
  },
  {
    title: "Team & League Management",
    description: "Build rosters, track stats, and manage teams or host events.",
    icon: <GroupsIcon fontSize="large" color="primary" />,
  }
];

export default function FeatureGrid() {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Manage Sports Programs with Power & Flexibility
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ maxWidth: 700, mx: "auto", mb: 5 }}>
        Everything you need to run a successful season — all in one place.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {featureData.map((item, i) => (
          <Grid item key={i} size={{ xs: 12, sm: 6, md: 4 }} spacing={2}>
            <Card
              sx={{
       
                height: "100%",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: theme.shadows[6],
                  backgroundColor: theme.palette.grey[50]
                }
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                <Typography variant="body2">{item.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
