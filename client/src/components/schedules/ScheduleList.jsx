// components/schedule/ScheduleList.jsx
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useSport } from '../../context/SportContext';

export default function ScheduleList({ schedules }) {
  const { sport } = useSport();

  return (
    <Grid container spacing={2}>
      {schedules.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2">{item.date} | {item.time}</Typography>
              <Typography variant="body2">Sport: {item.sport}</Typography>
              <Typography variant="body2">Location: {item.location}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
