import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Container, CircularProgress } from '@mui/material';
import { useSport } from '../../context/SportsContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  console.log('players: ', players);
  const [loading, setLoading] = useState(true);
  const { sport } = useSport();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`/api/players?sport=${sport}`);
        setPlayers(response.data);
      } catch (err) {
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [sport]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Players</Typography>
      {loading ? <CircularProgress /> : (
        <Grid container spacing={3}>
          {players.map(player => (
            <Grid item key={player.id} xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card onClick={() => navigate(`/players/${player.id}`)} sx={{ cursor: 'pointer' }}>
                  <CardContent>
                    <Typography variant="h6">{player.full_name}</Typography>
                    <Typography color="textSecondary">{player.sport}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
