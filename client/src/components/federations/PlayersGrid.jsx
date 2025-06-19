import React from 'react';
import { Grid, Typography, Card, CardContent, CardActions, Button } from '@mui/material';

const PlayersGrid = ({ players }) => {
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
                {player.position && (
                  <Typography variant="body2">Position: {player.position}</Typography>
                )}
                {player.club_team && (
                  <Typography variant="body2">Club: {player.club_team}</Typography>
                )}
                {player.stat_summary && (
                  <Typography variant="body2">{player.stat_summary}</Typography>
                )}
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
