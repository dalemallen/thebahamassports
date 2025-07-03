import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsIcon from '@mui/icons-material/Sports';

const EventCard = ({ event, onClick }) => {
  let icon = <EventAvailableIcon sx={{ color: '#00A3E0' }} />;
  if (event.type === 'Tournament') icon = <EmojiEventsIcon sx={{ color: '#FFD100' }} />;
  else if (event.type === 'League') icon = <SportsSoccerIcon sx={{ color: '#00A3E0' }} />;
  else if (event.type === '1-Day Event') icon = <SportsIcon sx={{ color: '#FFD100' }} />;

  return (
    <Card
      onClick={onClick}
      tabIndex={0}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: 3,
        outline: 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 0 0 3px #FFD10055`,
        },
        '&:focus': {
          boxShadow: `0 0 0 3px #FFD100aa`,
        },
             boxShadow: `0 0 0 3px #FFD100aa`,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          {icon}
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ flex: 1 }}
            noWrap
          >
            {event.title}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {event.sport_name} — {event.location}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {new Date(event.start_date).toLocaleDateString()}
        </Typography>

        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip
            label={event.type || 'Event'}
            color="primary"
            size="small"
            sx={{
              backgroundColor: '#00A3E0',
              color: '#fff',
              fontSize: 12
            }}
          />
          <Chip
            label={event.status}
            size="small"
            sx={{
              backgroundColor: event.status === 'upcoming' ? '#00A3E0' : '#FFD100',
              color: '#fff',
              fontSize: 12
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
