import React from 'react';
import { Typography, Box, Avatar } from '@mui/material';

export default function FederationHeader({ logo, name, sport, description }) {
  return (
    <Box sx={{ textAlign: 'center', my: 4 }}>
      <Avatar src={logo} sx={{ width: 100, height: 100, mx: 'auto' }} />
      <Typography variant="h4" mt={2}>{name}</Typography>
      <Typography variant="subtitle1" color="text.secondary">{sport}</Typography>
      <Typography variant="body1" mt={1}>{description}</Typography>
    </Box>
  );
}