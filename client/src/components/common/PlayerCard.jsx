import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';

const PlayerCard = ({ player, loading = false }) => {
  console.log('player: ', player);
  if (loading) {
    return (
      <Card sx={{ display: 'flex', mb: 2, p: 2, alignItems: 'center' }}>
        <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" height={28} />
          <Skeleton width="40%" />
          <Skeleton width="50%" />
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ display: 'flex', mb: 2, p: 2, alignItems: 'center' }}>
      <Avatar
        src={player.profile_picture_url || ''}
        alt={`${player.first_name} ${player.last_name}`}
        sx={{ width: 56, height: 56, mr: 2 }}
      />

      <Box>
        <Typography variant="h6">
          <Link to={`/players/${player.user_id}`}>
            {player.first_name} {player.last_name}
          </Link>
        </Typography>

        {player.sport && (
          <Typography variant="body2" color="textSecondary">
            Sport: {player.sport}
          </Typography>
        )}

        {player.position && (
          <Typography variant="body2" color="textSecondary">
            Position: {player.position}
          </Typography>
        )}

        {player.team_id && player.team_name && (
          <Typography variant="body2">
            Team:{' '}
            <Link to={`/teams/${player.team_id}`}>
              {player.team_name}
            </Link>
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default PlayerCard;
