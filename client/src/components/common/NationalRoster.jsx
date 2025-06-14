import React from 'react';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';

export default function NationalRoster({ players = [] }) {
  return (
    <Grid container spacing={2}>
      {players.map(player => (
        <Grid item xs={12} sm={6} md={4} key={player.id}>
          <Card>
            <CardContent>
              <Avatar sx={{ mb: 1 }}>{player.first_name[0]}</Avatar>
              <Typography variant="body1">{player.first_name} {player.last_name}</Typography>
              <Typography variant="body2" color="text.secondary">{player.position?.join(', ')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}