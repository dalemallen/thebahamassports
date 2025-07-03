import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WebIcon from "@mui/icons-material/Web";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";

const features = [
  {
    title: "Seamless Registration",
    description: "Collect sign-ups and payments effortlessly with flexible forms.",
    icon: <PersonIcon fontSize="large" />,
  },
  {
    title: "Smart Scheduling",
    description: "Auto-generate conflict-free calendars for practices, games, and events.",
    icon: <ScheduleIcon fontSize="large" />,
  },
  {
    title: "Custom Websites",
    description: "Launch a stunning site for your team or league — no coding needed.",
    icon: <WebIcon fontSize="large" />,
  },
  {
    title: "Built-In Fundraising",
    description: "Raise funds, track sponsors, and accept donations with ease.",
    icon: <VolunteerActivismIcon fontSize="large" />,
  },
  {
    title: "Scouting-Ready Profiles",
    description: "Showcase athlete stats, achievements, and highlights in one place.",
    icon: <StarIcon fontSize="large" />,
  },
  {
    title: "Full Team Control",
    description: "Manage rosters, track stats, and run your league like a pro.",
    icon: <GroupsIcon fontSize="large" />,
  },
];

export default function FeatureGrid() {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 10, md: 14 }, px: 3, backgroundColor: "#fff" }}>
      <Typography
        variant="h4"
        fontWeight={800}
        align="center"
        sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
      >
        Tools That Power Every Part of Your Sports Program
      </Typography>

      <Grid container spacing={4}>
        {features.map((item, index) => (
          <Grid size={{xs:12, sm:6, md:4}} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 14px 28px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <Box
                    sx={{
                      color: theme.palette.secondary.main,
                      mb: 3,
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "2.25rem",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", maxWidth: 280, mx: "auto" }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
