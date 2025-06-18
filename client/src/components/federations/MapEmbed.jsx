import React from 'react';
import { Box, Typography } from '@mui/material';

const MapEmbed = () => (
  <Box sx={{ my: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Federation Headquarters</Typography>
    <iframe
      title="Federation Map"
      src="https://www.google.com/maps/embed?pb=!1m18..."
      width="100%"
      height="300"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
    ></iframe>
  </Box>
);

export default MapEmbed;