import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import FilterBar from '../../components/athletes/FilterBar';
import PlayerCard from '../../components/common/AthleteCard';

export default function PlayerDirectory() {
  const [athletes, setPlayers] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        const res = await axios.get(`/api/athletes?${params}`);
        setPlayers(res.data);
      } catch (err) {
        console.error('Error fetching athletes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [filters]);

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>Player Directory</Typography>
      <FilterBar filters={filters} setFilters={setFilters} />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {athletes.map((athletes) => (
            <Grid key={athletes.id} size={{ xs: 12, sm: 6, md: 4 }} >
          <Link to={`/athletes/${athletes.id}`} style={{ textDecoration: 'none' }}>
      <PlayerCard athletes={athletes} />
    </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
