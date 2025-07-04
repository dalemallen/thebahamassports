import { Box, Typography, Stack, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import heroImage from "/illustration/hero.png"; // rename uploaded image accordingly

export default function HeroBanner() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        // px: { xs: 3, md: 12 },
        py: { xs: 10, md: 16 },
        backgroundColor: "#fff",
        gap: { xs: 6, md: 10 },
      }}
    >
      {/* Left: Content */}
      <Box sx={{ flex: 1, zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              fontWeight: 900,
              lineHeight: 1.2,
              mb: 3,
              color: "#000",
            }}
          >
            The Digital Sports Hub for<br /> The Bahamas
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              color: "text.secondary",
              mb: 4,
              maxWidth: 520,
            }}
          >
            From athlete profiles to event scheduling, TheBahamasSports connects athletes, teams, and federations under one powerful platform.
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: "#007db3",
                },
              }}
            >
              Get Started Free
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#000",
                color: "#000",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Book a Demo
            </Button>
          </Stack>
        </motion.div>
      </Box>

      {/* Right: Illustration */}
      <Box sx={{ flex: 1, textAlign: "center" }}>
        <motion.img
          src={heroImage}
          alt="Digital Sports Hub Illustration"
          style={{ maxWidth: "100%", height: "auto", maxHeight: 500 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </Box>
    </Box>
  );
}
