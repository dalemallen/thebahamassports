// src/components/federations/WeeklySummary.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const WeeklySummary = ({ summary }) => {
  console.log('summary: ', summary);
  if (!summary) return <Typography>No weekly summary available.</Typography>;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="text.secondary">
        Weekly Summary
      </Typography>
      <Typography variant="body1">
        {summary.text || '8 matches • 3 new athletes • 2 new teams this week'}
      </Typography>
    </Box>
  );
};

export default WeeklySummary;
