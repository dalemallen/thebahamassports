import React from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/common/Sidebar'; // your custom sidebar component
import Header from '../components/common/Header';


export default function DashboardLayout({ children }) {
  const { dbUser, user } = useUser(); // ✅ Grab from context
  const userRole = dbUser?.role || user?.["https://thebahamassports.com/roles"]?.[0];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>   <Header />
    <Box sx={{ display: 'flex' }}>
    
      {/* Sidebar hidden on mobile */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#003c88', color: '#fff' },
          }}
        >
          <Sidebar role={userRole}/>
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
    </>
  );
}
