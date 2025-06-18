// src/components/federations/PlayersGrid.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import axios from 'axios';

const PlayersGrid = ({ federationId }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(`/api/federations/${federationId}/athletes`);
        setPlayers(res.data);
      } catch (err) {
        console.error('Error fetching players:', err);
      }
    };
    fetchPlayers();
  }, [federationId]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Top Athletes
      </Typography>
      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {player.first_name} {player.last_name}
                </Typography>
                <Typography variant="body2">Position: {player.position}</Typography>
                <Typography variant="body2">Club: {player.club_team}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" href={`/players/${player.id}`}>
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default PlayersGrid;
