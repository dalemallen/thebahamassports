// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ScheduleCalendar from '../../components/schedules/ScheduleCalendar';
import EventCard from '../../components/schedules/EventCard';
import EventModal from '../../components/schedules/EventModal';
import axios from 'axios';

const SchedulePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sport, setSport] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
const [selectedEvent, setSelectedEvent] = useState(null);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events'); // or /api/events/upcoming
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setSport(selected);
    if (selected === 'All') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(ev => ev.sport_name === selected));
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Schedule</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Sport</InputLabel>
        <Select value={sport} label="Filter by Sport" onChange={handleFilterChange}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Rugby">Rugby</MenuItem>
          <MenuItem value="Track & Field">Track & Field</MenuItem>
          <MenuItem value="Swimming">Swimming</MenuItem>
          {/* Dynamically map from sports if needed */}
        </Select>
      </FormControl>

 <ScheduleCalendar
  events={filteredEvents}
  onEventClick={(eventInfo) => {
    const clickedEvent = filteredEvents.find(ev => ev.title === eventInfo.event.title);
    setSelectedEvent(clickedEvent);
    setModalOpen(true);
  }}
/>

<EventModal open={modalOpen} onClose={() => setModalOpen(false)} event={selectedEvent} />


      <Typography variant="h6" sx={{ mt: 4 }}>Upcoming Events</Typography>
      <Grid container spacing={2}>
        {filteredEvents.slice(0, 3).map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SchedulePage;
