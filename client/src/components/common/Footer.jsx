// src/components/layout/Footer.jsx
import { Box, Typography, Grid, Link } from "@mui/material";
import { useSport } from "../../context/SportsContext";

export default function Footer() {
  const { sport } = useSport();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#000",
        color: "#fff",
        mt: "auto",
        px: 3,
        py: 4,
      }}
    >
      <Grid container spacing={4} justifyContent="space-between">
        {/* Left */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" gutterBottom>
            TheBahamasSports
          </Typography>
          <Typography variant="body2">
            Building the future of Bahamian sports, one athlete at a time.
          </Typography>
        </Grid>

        {/* Center links */}
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" gutterBottom>
            Explore
          </Typography>
          <Link href="/" color="inherit" underline="hover">Home</Link><br />
          <Link href={`/sports?sport=${sport}`} color="inherit" underline="hover">Sports</Link><br />
          <Link href={`/schedule?sport=${sport}`} color="inherit" underline="hover">Schedule</Link><br />
          <Link href="/login" color="inherit" underline="hover">Login</Link>
        </Grid>

        {/* Right links */}
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" gutterBottom>
            Community
          </Typography>
          <Link href={`/federations?sport=${sport}`} color="inherit" underline="hover">Federations</Link><br />
          <Link href={`/teams?sport=${sport}`} color="inherit" underline="hover">Teams</Link><br />
          <Link href={`/players?sport=${sport}`} color="inherit" underline="hover">Players</Link>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <Typography variant="caption">
          © {currentYear} TheBahamasSports. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
