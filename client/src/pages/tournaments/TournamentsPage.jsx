
import React, { useEffect, useState, useContext } from 'react';
import {
  Container, Box, Typography, Grid, Button, Select, MenuItem, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../../context/UserContext";

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  console.log('tournaments: ', tournaments);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  console.log('user: ', user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [sportsRes, tournamentsRes] = await Promise.all([
        axios.get('/api/sports/with-federations'),
        axios.get('/api/tournaments')
      ]);
      setSports(sportsRes.data);
      setTournaments(tournamentsRes.data);
    };
    fetchData();
  }, []);

  const filtered = tournaments.filter(l =>
    (!selectedSport || l.sport_id === selectedSport) &&
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Tournaments</Typography>
        {user?.role === 'federation' && (
          <Button variant="contained" onClick={() => navigate('/tournaments/create')}>
            + Create New
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value=''>All Sports</MenuItem>
            {sports.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            placeholder="Search by title or organizer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filtered.map(l => (
          <Grid item xs={12} key={l.id}>
            <Box p={2} border={1} borderRadius={2}>
              <Typography variant="h6">{l.title}</Typography>
              <Typography variant="body2">Organized by: {l.organizer_name}</Typography>
              <Typography variant="body2">Dates: {l.start_date} - {l.end_date}</Typography>
              <Button size="small" onClick={() => navigate(`/tournaments/${l.id}`)}>View Details</Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TournamentsPage;
