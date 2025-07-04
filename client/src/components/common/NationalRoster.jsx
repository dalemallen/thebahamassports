import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';

export default function NationalRoster({ athletes = [] }) {
  return (
    <Grid container spacing={2}>
      {athletes.map(athlete => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={athlete.id}>
          <Card>
            <CardContent>
              <Avatar sx={{ mb: 1 }}>{athlete.first_name[0]}</Avatar>
              <Typography variant="body1">{athlete.first_name} {athlete.last_name}</Typography>
              <Typography variant="body2" color="text.secondary">{athlete.position?.join(', ')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}