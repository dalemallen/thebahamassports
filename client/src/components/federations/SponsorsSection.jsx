import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const SponsorsSection = () => (
  <Box sx={{ my: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Sponsors</Typography>
    <Grid container spacing={2}>
      {[1, 2, 3].map((sponsor) => (
        <Grid size={{xs:12, md:4}} key={sponsor}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sponsor {sponsor}</Typography>
              <Typography variant="body2">Supporting youth sports</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default SponsorsSection;