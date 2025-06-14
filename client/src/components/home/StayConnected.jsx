import { Box, Typography, TextField, Button } from "@mui/material";

export default function StayConnected() {
  return (
    <Box sx={{ py: 6, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>Stay Connected</Typography>
      <TextField placeholder="Enter your email" sx={{ width: 300 }} />
      <Button variant="contained" sx={{ ml: 2 }}>Subscribe</Button>
    </Box>
  );
}
