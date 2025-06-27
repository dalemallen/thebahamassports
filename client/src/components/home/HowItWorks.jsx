import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Create Your Free Account",
    description: "Choose your role — Athlete, Team, Coach, or Federation. Get access instantly.",
    icon: <PersonAddAltIcon sx={{ fontSize: 80 }} />,
    bg: "#fefefe",
  },
  {
    title: "Build Your Profile",
    description: "Showcase rosters, stats, and more — your brand, your sport, your legacy.",
    icon: <DescriptionIcon sx={{ fontSize: 80 }} />,
    bg: "#f9f9f9",
  },
  {
    title: "Join or Host Events",
    description: "Register for leagues or run your own tournaments. Real-time. Local.",
    icon: <EmojiEventsIcon sx={{ fontSize: 80 }} />,
    bg: "#fff7e0",
  },
  {
    title: "Manage Everything Online",
    description: "From schedules to messaging — it's your digital control center.",
    icon: <SmartphoneIcon sx={{ fontSize: 80 }} />,
    bg: "#f0fbff",
  },
];

export default function HowItWorks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ pt: 10, backgroundColor: "#fff" }}>
      <Typography
        variant="h3"
        align="center"
        fontWeight={900}
        sx={{ mb: 10 }}
      >
        How It Works
      </Typography>

      <Stack spacing={6}>
        {steps.map((step, index) => (
          <Box
            key={index}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" },
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 3, md: 10 },
              py: 6,
              backgroundColor: step.bg,
              borderRadius: 6,
            }}
          >
            {/* Icon side */}
            <Box
              sx={{
                flexShrink: 0,
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "100%", md: "30%" },
                mb: { xs: 4, md: 0 },
              }}
            >
              {step.icon}
            </Box>

            {/* Text side */}
            <Box sx={{ width: { xs: "100%", md: "65%" } }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {step.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
