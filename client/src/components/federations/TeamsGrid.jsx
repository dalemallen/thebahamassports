// src/components/federations/TeamsGrid.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import axios from 'axios';

const TeamsGrid = ({ federationId }) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`/api/federations/${federationId}/teams`);
        setTeams(res.data);
      } catch (err) {
        console.error('Error fetching teams:', err);
      }
    };
    fetchTeams();
  }, [federationId]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Registered Teams
      </Typography>
      <Grid container spacing={2}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Typography variant="body2">Sport ID: {team.sport_id}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" href={`/teams/${team.id}`}>
                  View Team
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TeamsGrid;