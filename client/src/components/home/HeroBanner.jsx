import { Box, Typography, Stack, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <Box
      sx={{
        py: 10,
        px: 3,
        textAlign: "center",
        backgroundColor: "#f4f7ff",
        backgroundImage: "url('/hero-bg-pattern.png')", // optional
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ maxWidth: 800, mx: "auto", mb: 3 }}
        >
          All-in-One Sports Registration & Management Platform
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
        >
          Streamline your team, league, or school sports programs. Manage rosters, schedules, events, and athlete development — all from one dashboard.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button variant="contained" size="large">
            Get Started Free
          </Button>
          <Button variant="outlined" size="large">
            Book a Demo
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
}
