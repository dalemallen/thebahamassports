
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const NextEvents = ({ events }) => (
  <Box>
    {events.map((event) => (
      <Paper key={event.id} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">{event.name}</Typography>
        <Typography>{event.date}</Typography>
        <Typography>{event.details}</Typography>
      </Paper>
    ))}
  </Box>
);

export default NextEvents;
