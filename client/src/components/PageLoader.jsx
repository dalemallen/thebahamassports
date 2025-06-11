// src/components/PageLoader.jsx
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function PageLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9'
      }}
    >
      <CircularProgress />
    </Box>
  );
}
