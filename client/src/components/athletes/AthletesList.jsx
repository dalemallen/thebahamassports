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

export default function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sport } = useSport();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const response = await axios.get(`/api/athletes?sport=${sport}`);
        setAthletes(response.data);
      } catch (err) {
        console.error('Error fetching athletes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAthletes();
  }, [sport]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Athletes
      </Typography>

      <Grid container spacing={3}>
        {(loading ? Array.from(new Array(6)) : athletes).map((athlete, index) => (
          <Grid key={athlete?.id || index}  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => !loading && athlete?.id && navigate(`/athletes/${athlete.id}`)}
                sx={{ cursor: loading ? 'default' : 'pointer', p: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {loading ? (
                    <Skeleton variant="circular" width={50} height={50} />
                  ) : (
                    <Avatar
                      src={athlete.profile_photo_url || undefined}
                      alt={`${athlete.first_name} ${athlete.last_name}`}
                    >
                      {athlete.first_name?.[0]}
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
                          {athlete.first_name} {athlete.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Array.isArray(athlete.position)
                            ? athlete.position.join(', ')
                            : athlete.position || '—'}
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
