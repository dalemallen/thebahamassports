import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

export default function OpportunitiesSection() {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Opportunities & Highlights</Typography>
      <Typography>🏆 National Team Tryout — Basketball (U18) — July 12</Typography>
      <Button variant="contained" sx={{ mt: 1 }} color="warning">Apply Now</Button>
      <Typography sx={{ mt: 2 }}>🎥 Upload Highlight Video</Typography>
      <Typography>👀 View Scouting Requests (2)</Typography>
    </Paper>
  );
}