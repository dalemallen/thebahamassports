import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const EventModal = ({ open, onClose, event }) => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!event) return null;

  const handleView = () => {
    onClose();
    navigate(`/events/${event.id}`);
  };

  const handleRegister = () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: `/events/${event.id}/register`
        }
      });
    } else {
      navigate(`/events/${event.id}/register`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'info';
      case 'completed': return 'default';
      default: return 'warning';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          {event.logo_url ? (
            <img
              src={event.logo_url}
              alt={`${event.title} logo`}
              style={{
                height: 60,
                width: 60,
                borderRadius: 8,
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 60,
                width: 60,
                borderRadius: 8,
                backgroundColor: '#00A3E0',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
              }}
            >
              <EventAvailableIcon />
            </Box>
          )}

          <Box>
            <Typography variant="h6" fontWeight={600}>
              {event.title}
            </Typography>

            <Box mt={0.5} display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={event.type || 'Event'}
                sx={{
                  backgroundColor: '#00A3E0',
                  color: '#fff',
                  fontSize: 12,
                }}
                size="small"
              />
              <Chip
                label={event.status}
                color={getStatusColor(event.status)}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="body1">
            <strong>Sport:</strong> {event.sport_name}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {event.location}
          </Typography>
          <Typography variant="body1">
            <strong>Start:</strong> {new Date(event.start_date).toLocaleString()}
          </Typography>
          {event.end_date && (
            <Typography variant="body1">
              <strong>End:</strong> {new Date(event.end_date).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {event.description && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {event.description}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleView} variant="outlined" sx={{ borderColor: '#00A3E0', color: '#00A3E0' }}>
          View Event
        </Button>
        <Button
          onClick={handleRegister}
          variant="contained"
          sx={{ backgroundColor: '#00A3E0', '&:hover': { backgroundColor: '#007bb6' } }}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
