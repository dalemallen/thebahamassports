import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const ProfileForm = ({ endpoint, initialData = {}, onComplete }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ...initialData
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!endpoint) return setLoading(false);
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = res.data;
        setFormData((prev) => ({
          ...prev,
          first_name: data.first_name || '',
          last_name: data.last_name || ''
        }));
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [getAccessTokenSilently, endpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      await axios.patch(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Failed to submit form', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Profile Setup</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Complete Profile'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileForm;
