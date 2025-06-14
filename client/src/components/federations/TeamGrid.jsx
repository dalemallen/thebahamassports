import React from 'react';
import { Card, CardContent, Grid, Typography, Avatar } from '@mui/material';

export default function TeamGrid({ teams = [] }) {
  return (
    <Grid container spacing={3}>
      {teams.map(team => (
        <Grid item xs={12} sm={6} md={4} key={team.id}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar src={team.logo_url} sx={{ width: 56, height: 56, mr: 2 }} />
            <CardContent>
              <Typography variant="h6">{team.name}</Typography>
              <Typography variant="body2" color="text.secondary">{team.region}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}