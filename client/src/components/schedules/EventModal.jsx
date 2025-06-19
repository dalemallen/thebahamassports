// src/components/schedule/EventModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material';

const EventModal = ({ open, onClose, event }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1"><strong>Sport:</strong> {event.sport_name}</Typography>
        <Typography variant="body1"><strong>Location:</strong> {event.location}</Typography>
        <Typography variant="body1"><strong>Start:</strong> {new Date(event.start_date).toLocaleString()}</Typography>
        <Typography variant="body1"><strong>End:</strong> {new Date(event.end_date).toLocaleString()}</Typography>
        {event.description && (
          <Typography variant="body2" sx={{ mt: 2 }}>{event.description}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {/* Optionally add: <Button>RSVP</Button> or <Button>View More</Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
