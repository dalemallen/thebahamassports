import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

const pricingData = {
  Athlete: {
    basic: ["Create Profile", "View Events", "Join Public Leagues"],
    premium: ["Advanced Stats", "Verified Badges", "Scouting Access"],
  },
  Coach: {
    basic: ["Team Management", "Roster Builder"],
    premium: ["Match Analytics", "Private Team Rooms", "Tactical Tools"],
  },
  Team: {
    basic: ["Roster", "Schedule"],
    premium: ["Custom Branding", "Host Tournaments", "Fan Pages"],
  },
  "Parent/Guardian": {
    basic: ["Track Child Activity"],
    premium: ["Event Notifications", "Private Messaging"],
  },
  Organization: {
    basic: ["Federation Profile", "Public Event Listing"],
    premium: ["Private League Tools", "Document Upload", "Approval Dashboard"],
  },
  Sponsor: {
    basic: ["Public Listing"],
    premium: ["Feature Placement", "Analytics", "Athlete Sponsorship Tools"],
  },
};

export default function PricingTable() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Compare Plans
      </Typography>

      <Grid container spacing={4}>
        {Object.entries(pricingData).map(([role, tiers]) => (
          <Grid item key={role} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {role}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Feature</TableCell>
                    <TableCell align="center">Basic</TableCell>
                    <TableCell align="center">Premium</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(
                    new Set([...tiers.basic, ...tiers.premium])
                  ).map((feature) => (
                    <TableRow key={feature}>
                      <TableCell>{feature}</TableCell>
                      <TableCell align="center">
                        {tiers.basic.includes(feature) ? "✅" : ""}
                      </TableCell>
                      <TableCell align="center">
                        {tiers.premium.includes(feature) ? "✅" : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
