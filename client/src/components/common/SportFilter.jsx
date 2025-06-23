import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const SportFilter = ({ value, onChange, label = 'Sport' }) => {
  const [sports, setSports] = useState([]);

  useEffect(() => {
    axios.get('/api/sports/with-federations')
      .then(res => setSports(res.data))
      .catch(err => console.error('Failed to fetch sports:', err));
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={e => onChange(e.target.value)}>
        <MenuItem value=""><em>All</em></MenuItem>
        {sports.map(sport => (
          <MenuItem key={sport.id} value={sport.id}>{sport.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SportFilter;
