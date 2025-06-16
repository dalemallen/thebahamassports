import React from 'react';
import Header from '../components/Header';
import Container from '@mui/material/Container';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
}