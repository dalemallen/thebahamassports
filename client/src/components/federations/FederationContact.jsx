import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const FederationContact = ({ federation }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Contact</Typography>
      <Typography variant="body2">Email: info@{federation?.name?.toLowerCase().replaceAll(' ', '')}.bs</Typography>
      <Typography variant="body2">Website: <Link href="https://example.bs">example.bs</Link></Typography>
      <Typography variant="body2">Phone: (242) 555-1234</Typography>
    </Box>
  );
};

export default FederationContact;
