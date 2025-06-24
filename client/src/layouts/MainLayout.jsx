import React from 'react';
import Header from '../components/common/Header';
import Container from '@mui/material/Container';
import Footer from '../components/common/Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
      <Footer/>
    </>
  );
}