import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';

const FederationHeader = ({ name, sportId, sports, handleSportChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, mt: -10, mb: 4 }}>
    <Typography variant="h4" fontWeight={600} color="#fff" sx={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>
      {name}
    </Typography>
    <FormControl>
      <Select value={sportId} onChange={handleSportChange} size="small">
        {sports.map((sport) => (
          <MenuItem key={sport.id} value={sport.id}>
            {sport.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default FederationHeader;