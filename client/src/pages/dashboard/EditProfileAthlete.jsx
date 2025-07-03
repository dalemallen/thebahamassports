import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Container,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function EditProfileAthlete() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    birthdate: null,
    nationality: '',
    height: '',
    weight: '',
    position: '',
    preferredSide: '',
    clubTeam: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto' }} />
            <IconButton component="label">
              <PhotoCamera />
              <input hidden accept="image/*" type="file" />
            </IconButton>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Email" name="email" value={profile.email} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birthdate"
                value={profile.birthdate}
                onChange={(newValue) => setProfile((prev) => ({ ...prev, birthdate: newValue }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Nationality" name="nationality" value={profile.nationality} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Height (cm)" name="height" value={profile.height} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Weight (kg)" name="weight" value={profile.weight} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Position" name="position" value={profile.position} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Preferred Side" name="preferredSide" value={profile.preferredSide} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Club Team" name="clubTeam" value={profile.clubTeam} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12 }} sx={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
