import React from 'react';
import Header from '../components/Header';

export default function OnboardingLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}