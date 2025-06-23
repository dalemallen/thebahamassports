
import React from 'react';
import { TextField, Typography, Grid, Button } from '@mui/material';

const DynamicListInput = ({ label, values, onChange, onAdd, onRemove, placeholder }) => (
  <>
    <Typography variant="subtitle1" sx={{ mt: 2 }}>{label}</Typography>
    {values.map((val, idx) => (
      <Grid container spacing={1} alignItems="center" key={idx}>
        <Grid  size={{xs:10}}>
          <TextField
            fullWidth
            value={val}
            placeholder={placeholder}
            onChange={(e) => onChange(idx, e.target.value)}
          />
        </Grid>
        <Grid  size={{xs:2}}>
          <Button onClick={() => onRemove(idx)}>-</Button>
        </Grid>
      </Grid>
    ))}
    <Button onClick={onAdd} sx={{ mt: 1 }}>+ Add {label}</Button>
  </>
);

export default DynamicListInput;
