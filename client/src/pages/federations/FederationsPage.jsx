import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  Paper
} from '@mui/material';
import axios from 'axios';

const FederationPage = () => {
  const { sportId } = useParams();
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [federation, setFederation] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportsRes = await axios.get('/api/sports');
        setSports(sportsRes.data);

        const federationRes = await axios.get(`/api/federations/by-sport/${sportId}`);
        setFederation(federationRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, [sportId]);

  const handleSportChange = (e) => {
    navigate(`/sports/${e.target.value}`);
  };

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          {federation?.name || 'Federation'}
        </Typography>
        <FormControl>
          <Select value={sportId} onChange={handleSportChange} size="small">
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {federation?.description || 'Learn more about this sport and its opportunities.'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" href={`/register?role=athlete&sport=${sportId}`}>
              Register as Athlete
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" href={`/register?role=team&sport=${sportId}`}>
              Register a Team
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb: 3 }}>
        <Tab label="Players" />
        <Tab label="Clubs" />
        <Tab label="Stats" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Typography variant="h6">Top Athletes</Typography>
          {/* Replace with PlayerCard components */}
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <Typography variant="h6">Clubs</Typography>
          {/* Replace with ClubCard components */}
        </Box>
      )}
      {tab === 2 && (
        <Box>
          <Typography variant="h6">Stats</Typography>
          {/* Replace with StatsTable or Leaderboard components */}
        </Box>
      )}
    </Container>
  );
};

export default FederationPage;
