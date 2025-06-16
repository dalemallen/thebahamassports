import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Link } from '@mui/material';

export default function TeamList() {
  return (
    <Paper elevation={3} sx={{ p: 2, bgcolor: '#e3f2fd' }}>
      <Typography variant="h6">My Teams</Typography>
      <List>
        <ListItem><ListItemText primary="Bahamas U17 Basketball" /></ListItem>
        <ListItem><ListItemText primary="Carmichael All Stars" /></ListItem>
      </List>
      <Typography variant="body2">
        <Link href="#">View Schedule</Link> | <Link href="#">Contact Coach</Link>
      </Typography>
    </Paper>
  );
}