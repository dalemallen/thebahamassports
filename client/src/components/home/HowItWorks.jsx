import {
  Grid,
  Typography,
  Box,
  Paper,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Create Your Free Account",
    description:
      "Choose your role — Athlete, Team, Coach, or Federation — and get started instantly.",
    icon: <PersonAddAltIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "Build Your Profile",
    description:
      "Add player info, team rosters, or event details. Showcase your organization.",
    icon: <DescriptionIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "Join or Host Events",
    description:
      "Apply to leagues or tournaments — or host your own with our tools.",
    icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "Manage Everything Online",
    description:
      "Use dashboards to handle schedules, communications, and RSVPs from anywhere.",
    icon: <SmartphoneIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
];

const ExpandIcon = styled(ExpandMoreIcon)(({ expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.3s ease",
}));

export default function HowItWorksTop() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExpandClick = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        How It Works
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {steps.map((step, index) => (
          <Grid key={index} item size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  minHeight: 240,
                  position: "relative",
                }}
              >
                <Box mb={1}>{step.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {step.title}
                </Typography>

                <Collapse in={!isMobile || expandedIndex === index}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {step.description}
                  </Typography>
                </Collapse>

                {isMobile && (
                  <IconButton
                    onClick={() => handleExpandClick(index)}
                    sx={{ position: "absolute", bottom: 8, right: 8 }}
                  >
                    <ExpandIcon expand={expandedIndex === index ? 1 : 0} />
                  </IconButton>
                )}
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
