
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const DashboardOverview = ({ stats }) => (
  <Grid container spacing={2}>
    {['athletes', 'coaches', 'teams'].map((key) => (
      <Grid  size={{xs:12, md: 4}} key={key}>
        <Paper elevation={3} style={{ padding: '1rem', textAlign: 'center' }}>
          <Typography variant="h6">Total {key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
          <Typography variant="h4">{stats[key]}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default DashboardOverview;
