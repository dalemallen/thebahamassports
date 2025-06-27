import React from 'react';
import { Box, Typography, Avatar, Button, Grid, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const TeamInfoBlock = ({ team }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            src={team.logo_url}
            alt={team.name}
            sx={{ width: 80, height: 80, border: '2px solid #00A3E0' }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h5" fontWeight="bold">
            {team.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {team.age_group} • {team.gender} • {team.location}
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Coaches:</strong> {team.coach_names?.join(', ') || 'N/A'}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{
              borderColor: '#00A3E0',
              color: '#00A3E0',
              '&:hover': {
                borderColor: '#0079a1',
                backgroundColor: 'rgba(0,163,224,0.05)',
              },
            }}
          >
            Edit Info
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TeamInfoBlock;
