import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const NewsletterSignup = () => (
  <Box sx={{ my: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Newsletter Signup</Typography>
    <TextField fullWidth label="Email Address" variant="outlined" sx={{ mb: 2 }} />
    <Button variant="contained">Subscribe</Button>
  </Box>
);

export default NewsletterSignup;