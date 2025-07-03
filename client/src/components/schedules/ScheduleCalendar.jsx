import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';
import {
Box,
Stack,
Chip,
Tooltip,
FormControl,
InputLabel,
Select,
MenuItem,
Typography
} from '@mui/material';
import axios from 'axios';

const ScheduleCalendar = ({ events, onEventClick }) => {
const [sportColorMap, setSportColorMap] = useState({});
const [eventTypes, setEventTypes] = useState([]);
const [selectedType, setSelectedType] = useState('All');

useEffect(() => {
const fetchSports = async () => {
try {
const sportsRes = await axios.get('/api/sports/with-federations');
const uniqueSports = sportsRes.data.map(({ sport }) => sport.name).filter(Boolean);
const fallbackColors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
const colorMap = uniqueSports.reduce((acc, sport, index) => {
acc[sport] = fallbackColors[index % fallbackColors.length];
return acc;
}, {});
setSportColorMap(colorMap);
} catch (err) {
console.error('Failed to fetch sports:', err);
}
};
fetchSports();
}, []);

useEffect(() => {
const types = Array.from(new Set(events.map(e => e.type).filter(Boolean)));
setEventTypes(['All', ...types]);
}, [events]);

const filteredEvents = selectedType === 'All' ? events : events.filter(e => e.type === selectedType);

const formattedEvents = filteredEvents.map(event => ({
id: event.id,
title: event.title,
start: event.start_date,
end: event.end_date || event.start_date,
extendedProps: {
location: event.location,
sport: event.sport_name,
status: event.status
}
}));

const uniqueSports = [...new Set(events.map(event => event.sport_name).filter(Boolean))];

return (
<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
<Box sx={{ p: 2, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
<Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
{uniqueSports.map(sport => (
<Chip key={sport} label={sport} color={sportColorMap[sport] || 'default'} size="small" />
))}
</Stack>

    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={formattedEvents}
      height="auto"
      selectable={true}
      eventClick={(arg) => {
        if (onEventClick && typeof onEventClick === 'function') {
          onEventClick(arg);
        }
      }}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      }}
eventContent={({ event }) => {
  const title = event.title;
  const location = event.extendedProps.location || 'N/A';
  const sport = event.extendedProps.sport;
  const date = new Date(event.start).toLocaleDateString();

  return (
    <Tooltip title={`Location: ${location}`} arrow>
      <Box sx={{ fontSize: 12, fontWeight: 500, p: 0.5, lineHeight: 1.2 }}>
        <Typography variant="subtitle2" noWrap>{title}</Typography>

      </Box>
    </Tooltip>
  );
}}

    />
  </Box>
</motion.div>
);
};

export default ScheduleCalendar;