import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

export default function PlayerDetails() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await axios.get(`/api/players/${id}`);
        setPlayer(res.data);
      } catch (err) {
        console.error('Error fetching player details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!player) return <Typography variant="h6">Player not found</Typography>;

  return (
    <Container maxWidth="md">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <Grid container>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                height="300"
                image={player.photo || '/placeholder.png'}
                alt={player.full_name}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h4">{player.full_name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{player.sport}</Typography>
                <Typography variant="body1" mt={2}>{player.bio}</Typography>
                <Typography variant="body2" mt={1}>Bracket: {player.bracket}</Typography>
                <Typography variant="body2">Premium: {player.premium ? 'Yes' : 'No'}</Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </motion.div>
    </Container>
  );
}
