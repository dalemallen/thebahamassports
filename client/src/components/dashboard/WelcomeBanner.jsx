import React from 'react';
import { Paper, Typography } from '@mui/material';

export default function WelcomeBanner({ name, sport, status, lastLogin }) {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5">Welcome Back, {name}! 🇧🇸</Typography>
      <Typography>You are registered for: <strong>{sport}</strong></Typography>
      <Typography>Status: <strong>{status}</strong> • Last login: {lastLogin}</Typography>
    </Paper>
  );
}