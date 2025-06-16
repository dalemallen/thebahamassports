import React from 'react';
import { useRole } from '../context/RoleContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children }) {
  const role = useRole();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role} />
      <main style={{ flex: 1 }}>
        <Header />
        <div style={{ padding: '1rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}