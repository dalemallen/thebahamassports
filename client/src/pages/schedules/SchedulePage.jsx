// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  useMediaQuery,
  Box,
} from '@mui/material';
import ScheduleCalendar from '../../components/schedules/ScheduleCalendar';
import EventCard from '../../components/schedules/EventCard';
import EventModal from '../../components/schedules/EventModal';
import EventFilters from '../../components/schedules/EventFilters';
import { motion } from 'framer-motion';
import axios from 'axios';

const SchedulePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sport, setSport] = useState('All');
  const [eventType, setEventType] = useState('All');
  const [sportOptions, setSportOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isMobile = useMediaQuery('(max-width:600px)');

  const eventTypeOptions = ['All', 'Tournament', 'League', '1-Day Event', 'Tryouts'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, sportsRes] = await Promise.all([
          axios.get('/api/events'),
          axios.get('/api/sports/with-federations')
        ]);

        setEvents(eventsRes.data);
        setFilteredEvents(eventsRes.data);

        const sportNames = sportsRes.data.map(({ sport }) => sport.name).filter(Boolean);
        setSportOptions(['All', ...sportNames]);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = events.filter(ev => {
      const sportMatch = sport === 'All' || ev.sport_name === sport;
      const typeMatch = eventType === 'All' || ev.type === eventType;
      return sportMatch && typeMatch;
    });
    setFilteredEvents(filtered);
  }, [sport, eventType, events]);

  const handleEventClick = ({ event }) => {
    const clickedEvent = filteredEvents.find(ev => String(ev.id) === String(event.id));
    setSelectedEvent(clickedEvent);
    setModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'success';
      case 'completed': return 'default';
      default: return 'warning';
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>Schedule</Typography>
      </Box>

      <EventFilters
        sportOptions={sportOptions}
        typeOptions={eventTypeOptions}
        sport={sport}
        eventType={eventType}
        onSportChange={setSport}
        onTypeChange={setEventType}
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {!isMobile ? (
          <ScheduleCalendar events={filteredEvents} onEventClick={handleEventClick} />
        ) : (
          filteredEvents.length === 0 ? (
            <Typography variant="body2" sx={{ mt: 2 }}>No events found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredEvents.map(event => (
                <Grid size={{xs:12 }} key={event.id}>
                  <Box sx={{ position: 'relative' }}>
                    <EventCard
                      event={event}
                      onClick={() => {
                        setSelectedEvent(event);
                        setModalOpen(true);
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: getStatusColor(event.status) || 'grey',
                        color: 'white',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {event.status}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <EventModal open={modalOpen} onClose={() => setModalOpen(false)} event={selectedEvent} />
      </motion.div>

<Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
  Upcoming Events
</Typography>

<Grid container spacing={2} sx={{ mb: 4 }}>
  {filteredEvents.slice(0, 3).map(event => (
    <Grid size={{xs:12, md:6}} md={4} key={event.id}>
      <EventCard
        event={event}
        onClick={() => {
          setSelectedEvent(event);
          setModalOpen(true);
        }}
      />
    </Grid>
  ))}
</Grid>

    </Container>
  );
};

export default SchedulePage;
