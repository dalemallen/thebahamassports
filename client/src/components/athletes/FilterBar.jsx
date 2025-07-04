import React from 'react';
import { Box, TextField, FormControlLabel, Checkbox } from '@mui/material';

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
      <TextField name="search" label="Search" onChange={handleChange} />
      <TextField name="position" label="Position" onChange={handleChange} />
      <TextField name="age_group" label="Age Group" onChange={handleChange} />
      <FormControlLabel
        control={<Checkbox onChange={(e) => setFilters({ ...filters, verified: e.target.checked })} />}
        label="Verified"
      />
      <FormControlLabel
        control={<Checkbox onChange={(e) => setFilters({ ...filters, mvp: e.target.checked })} />}
        label="MVP"
      />
    </Box>
  );
}
