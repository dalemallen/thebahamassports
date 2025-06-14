import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function SponsorCarousel({ sponsors = [] }) {
  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, py: 2 }}>
      {sponsors.map((s, idx) => (
        <Avatar key={idx} src={s.logo} sx={{ width: 80, height: 80 }} />
      ))}
    </Box>
  );
}