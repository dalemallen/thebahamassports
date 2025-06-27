import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";

const roles = {
  Athlete: {
    title: "For Athletes",
    description:
      "Showcase your skills, build your legacy, and open doors to national opportunities.",
    icon: <SportsSoccerIcon sx={{ fontSize: 100 }} />,
    button: "Start Your Journey",
    bg: "#E3F8FF",
  },
  Coach: {
    title: "For Coaches",
    description:
      "Lead your team, track performance, and manage development all in one place.",
    icon: <GroupsIcon sx={{ fontSize: 100 }} />,
    button: "Lead As Coach",
    bg: "#FFF3D2",
  },
  Federation: {
    title: "For Federations",
    description:
      "Digitize your operations, streamline event hosting, and power national growth.",
    icon: <EmojiEventsIcon sx={{ fontSize: 100 }} />,
    button: "Partner with Us",
    bg: "#F4EFFF",
  },
  School: {
    title: "For Schools",
    description:
      "Run competitions, manage student-athletes, and inspire the next generation.",
    icon: <SchoolIcon sx={{ fontSize: 100 }} />,
    button: "Join As School",
    bg: "#ECFDF5",
  },
  Organizer: {
    title: "For Organizers",
    description:
      "Launch tournaments, track progress, and build your community with ease.",
    icon: <EventIcon sx={{ fontSize: 100 }} />,
    button: "Host Events Now",
    bg: "#FFF1F1",
  },
};

export default function RoleHighlights() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState("Athlete");
  const selected = roles[tab];

  return (
    <Box sx={{ py: 14, px: 3, backgroundColor: "#fff", position: "relative" }}>
      <Typography
        variant="h3"
        fontWeight={900}
        align="center"
        sx={{ mb: 8 }}
      >
        Choose Your Role
      </Typography>

      {/* Tab Navigation */}
      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        variant={isMobile ? "scrollable" : "fullWidth"}
        centered={!isMobile}
        sx={{
          mb: 6,
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.secondary.main,
            height: 4,
          },
        }}
      >
        {Object.keys(roles).map((role) => (
          <Tab
            label={role}
            value={role}
            key={role}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            }}
          />
        ))}
      </Tabs>

      {/* Hero Panel */}
      <Box
        component={motion.div}
        key={tab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          backgroundColor: selected.bg,
          borderRadius: 6,
          px: { xs: 4, md: 10 },
          py: 8,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Icon / Visual */}
        <Box
          sx={{
            flex: "0 0 160px",
            color: theme.palette.secondary.main,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          {selected.icon}
        </Box>

        {/* Text / CTA */}
        <Box sx={{ maxWidth: 600 }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
            {selected.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {selected.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: "#0086be",
              },
            }}
          >
            {selected.button}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
