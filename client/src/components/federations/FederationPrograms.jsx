import React from 'react';
import { Card, CardContent, Typography, Grid, Chip } from '@mui/material';

export default function FederationPrograms({ programs = [] }) {
  return (
    <Grid container spacing={3}>
      {programs.map((prog) => (
        <Grid item xs={12} sm={6} md={4} key={prog.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{prog.title}</Typography>
              <Typography color="textSecondary">{prog.type}</Typography>
              <Chip label={prog.status} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}