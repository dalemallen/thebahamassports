import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function DocumentsSection() {
  return (
    <Paper elevation={3} sx={{ p: 2, bgcolor: '#fff3e0' }}>
      <Typography variant="h6">Documents & ID</Typography>
      <List>
        <ListItem><ListItemText primary="✅ Medical Form – Submitted" /></ListItem>
        <ListItem><ListItemText primary="❌ ID Verification – Missing" /></ListItem>
      </List>
    </Paper>
  );
}