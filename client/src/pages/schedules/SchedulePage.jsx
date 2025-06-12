// pages/SchedulePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScheduleList from '../components/schedule/ScheduleList';
import { Container, Typography } from '@mui/material';

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('/api/schedules');
        setSchedules(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Schedule</Typography>
      <ScheduleList schedules={schedules} />
    </Container>
  );
}
