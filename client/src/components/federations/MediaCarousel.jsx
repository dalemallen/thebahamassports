// src/components/federations/MediaCarousel.jsx
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const MediaCarousel = ({ highlights = [] }) => {
  if (!highlights.length) return <Typography>No media highlights available.</Typography>;

  return (
    <Box sx={{ overflowX: 'auto', display: 'flex', gap: 2, py: 2 }}>
      {highlights.map((item, idx) => (
        <Card key={idx} sx={{ minWidth: 240 }}>
          <CardContent>
            <Typography variant="subtitle2">{item.date}</Typography>
            <Typography variant="h6">{item.title}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MediaCarousel;
