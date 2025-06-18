import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box,Card, CardContent, CardActions, Button,CircularProgress, Paper } from '@mui/material';
import axios from 'axios';

const FederationStats = ({ federationId }) => {
    console.log('federationId: ', federationId);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!federationId) return;

    const fetchStats = async () => {
        console.log('here');
      try {
        const res = await axios.get(`/api/stats/by-sport/${federationId}`);
        console.log('res: ', res);
        setStats(res.data);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };
    fetchStats();
  }, [federationId]);

  if (!stats) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Sport Stats</Typography>
      <Grid container spacing={2}>
        {Object.entries(stats).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">{key.replace(/_/g, ' ')}</Typography>
              <Typography variant="h6">{value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default FederationStats;