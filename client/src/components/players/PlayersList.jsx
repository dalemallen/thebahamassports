import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Skeleton,
  Avatar,
  Box,
} from '@mui/material';
import { useSport } from '../../context/SportsContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Players
      </Typography>

      <Grid container spacing={3}>
        {(loading ? Array.from(new Array(6)) : players).map((player, index) => (
          <Grid item key={player?.id || index}  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => !loading && player?.id && navigate(`/players/${player.id}`)}
                sx={{ cursor: loading ? 'default' : 'pointer', p: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {loading ? (
                    <Skeleton variant="circular" width={50} height={50} />
                  ) : (
                    <Avatar
                      src={player.profile_photo_url || undefined}
                      alt={`${player.first_name} ${player.last_name}`}
                    >
                      {player.first_name?.[0]}
                    </Avatar>
                  )}

                  <Box>
                    {loading ? (
                      <>
                        <Skeleton width="80%" height={24} />
                        <Skeleton width="60%" height={18} />
                      </>
                    ) : (
                      <>
                        <Typography variant="h6">
                          {player.first_name} {player.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Array.isArray(player.position)
                            ? player.position.join(', ')
                            : player.position || '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {player.club_team || '—'}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
