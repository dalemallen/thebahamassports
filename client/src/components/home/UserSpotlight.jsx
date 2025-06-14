import { Card, CardContent, Typography, Box } from "@mui/material";

export default function UserSpotlight() {
  return (
    <Box sx={{ py: 6 }}>
      <Card sx={{ maxWidth: 600, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6">Athlete of the Month</Typography>
          <Typography>"TheBahamasSports gave me the chance to shine on a national stage!"</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
