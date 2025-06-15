import React from "react";
import { Container, Typography, Box } from "@mui/material";
import PricingTable from "../../components/pricing/PricingTable";

export default function Pricing() {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Pricing Plans
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Compare Basic and Premium features for every role on TheBahamasSports platform.
        </Typography>
      </Box>
      <PricingTable />
    </Container>
  );
}
