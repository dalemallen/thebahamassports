import React from 'react';
import {
  Paper,
  Avatar,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { CheckCircle, Star } from '@mui/icons-material';

export default function PlayerCard({ athletes }) {
  const {
    first_name,
    last_name,
    position,
    is_verified,
    is_mvp,
    profile_photo_url,
  } = athletes;

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        '&:hover': { boxShadow: 3 },
        cursor: 'pointer',
        height: '100%',
      }}
    >
      <Stack direction="column" alignItems="center" spacing={1}>
        <Avatar
          src={profile_photo_url}
          alt={`${first_name} ${last_name}`}
          sx={{ width: 80, height: 80 }}
        />
        <Typography fontWeight="bold" align="center">
          {first_name} {last_name}
        </Typography>
        {position && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
          >
            Position: {position}
          </Typography>
        )}
        <Stack direction="row" spacing={1} mt={1}>
          {is_verified && (
            <Chip
              icon={<CheckCircle />}
              label="Verified"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {is_mvp && (
            <Chip
              icon={<Star />}
              label="MVP"
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
