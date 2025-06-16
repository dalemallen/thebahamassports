import React from 'react';
import Container from '@mui/material/Container';

export default function AuthLayout({ children }) {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {children}
    </Container>
  );
}