import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function UpcomingEvents() {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">Upcoming Events</Typography>
      <List>
        <ListItem>
          <ListItemText primary="🏀 Mon – Basketball Practice – 4:30 PM" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🏀 Sat – League Match vs COB – 2:00 PM" />
        </ListItem>
      </List>
    </Paper>
  );
}