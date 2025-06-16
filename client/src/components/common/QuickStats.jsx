import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function QuickStats() {
  return (
    <Paper elevation={3} sx={{ p: 2, bgcolor: '#fff8e1' }}>
      <Typography variant="h6">Quick Stats</Typography>
      <List>
        <ListItem><ListItemText primary="Matches Played: 12" /></ListItem>
        <ListItem><ListItemText primary="Points Scored: 87" /></ListItem>
        <ListItem><ListItemText primary="Assists: 34" /></ListItem>
        <ListItem><ListItemText primary="Wins: 8" /></ListItem>
      </List>
    </Paper>
  );
}