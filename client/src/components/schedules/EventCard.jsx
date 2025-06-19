// src/components/schedule/EventCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const EventCard = ({ event }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{event.title}</Typography>
      <Typography variant="body2">{event.sport_name} - {event.location}</Typography>
      <Typography variant="body2">{new Date(event.start_date).toLocaleDateString()}</Typography>
    </CardContent>
  </Card>
);

export default EventCard;
