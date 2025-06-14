import { Box, Typography, Grid } from "@mui/material";

export default function PartnerCarousel() {
  const partners = ["/partner1.png", "/partner2.png", "/partner3.png"];
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Trusted By
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {partners.map((logo, i) => (
          <Grid item key={i}>
            <img src={logo} alt={`partner-${i}`} style={{ height: 40 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
