// src/components/common/UpcomingEvents.jsx
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const UpcomingEvents = ({ events = [] }) => {
  if (!events.length) return <Typography>No upcoming events.</Typography>;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Events</Typography>
      {events.slice(0, 2).map((event, idx) => (
        <Card key={idx} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2">{event.start_date}</Typography>
            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {event.location}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default UpcomingEvents;
