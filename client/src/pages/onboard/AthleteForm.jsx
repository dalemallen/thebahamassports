
import React, { useState, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, Button, Typography, TextField, MenuItem,
  Grid, Divider, Box, FormControlLabel, Checkbox, Container, Paper
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, differenceInYears } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../components/common/ImageUpload';
import DynamicListInput from '../../components/onboard/DynamicListInput';
import { toast } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';


const steps = ['Personal Info', 'Physical Stats', 'Career Info', 'Preview & Submit'];

const defaultAthlete = {
  first_name: '', last_name: '', birthdate: null, birthplace: '', nationality: '',
  height_cm: '', weight_kg: '', position: '', preferred_side: '',
  sport_id: '', club_team: '', debut_year: '', caps: '', points: '',
  achievements: [''], social_links: [''], profile_photo_url: '', show_public: true,
};

const AthleteForm = ({ onSubmit }) => {
  const { user } = useAuth0();
  const [athlete, setAthlete] = useState(defaultAthlete);
  console.log('athlete: ', athlete);
  const [activeStep, setActiveStep] = useState(0);
  const [sports, setSports] = useState([]);
  console.log('sports: ', sports);
  const [positions, setPositions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("athleteDraft");
    if (saved) setAthlete(JSON.parse(saved));
    axios.get('/api/sports/with-federations').then(res => setSports(res.data));
  }, []);

  useEffect(() => {
    localStorage.setItem("athleteDraft", JSON.stringify(athlete));
  }, [athlete]);

  useEffect(() => {
    if (athlete.sport_id) {
      axios.get(`/api/positions/${athlete.sport_id}`)
        .then(res => setPositions(res.data))
        .catch(() => setPositions([]));
    }
  }, [athlete.sport_id]);

  useEffect(() => {
    const interval = setInterval(() => {
const userId = user?.sub; // This is your Auth0 ID
console.log('userId: ', userId);
const payload = {
  ...athlete,
  auth0_id: userId
};

console.log("Submitting draft with auth0_id:", userId);
console.log('payload: ', payload);
axios.post('/api/athletes/save-draft', payload)

  .then(() => console.log(" Draft saved"))
  .catch((err) => console.error(" Draft save failed:", err));

    }, 30000);
    return () => clearInterval(interval);
  }, [athlete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAthlete(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (field, index, value) => {
    const updated = [...athlete[field]];
    updated[index] = value;
    setAthlete(prev => ({ ...prev, [field]: updated }));
  };

  const addListItem = (field) => {
    setAthlete(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field, index) => {
    const updated = [...athlete[field]];
    updated.splice(index, 1);
    setAthlete(prev => ({ ...prev, [field]: updated }));
  };

  const handleImageUpload = (url) => {
    setAthlete(prev => ({ ...prev, profile_photo_url: url }));
  };

  const clearDraft = () => {
    localStorage.removeItem("athleteDraft");
    setAthlete(defaultAthlete);
    setActiveStep(0);
  };

const handleNext = async () => {
  setActiveStep((prev) => prev + 1);
  try {
    const userId = user?.sub; // Ensure this is available
    const payload = {
      ...athlete,
      auth0_id: userId
    };

    await axios.post('/api/athletes/save-draft', payload);
  } catch (err) {
    console.error("Step change autosave failed", err);
  }
};


  const handleBack = () => setActiveStep((prev) => prev - 1);

  const validateFields = () => {
    const required = ['first_name', 'last_name', 'birthdate', 'sport_id'];
    const missing = required.filter((key) => !athlete[key]);
    if (missing.length > 0) {
      toast.error(`Missing required fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('here');
    if (!validateFields()) return;
    try {
      await onSubmit(athlete);
      toast.success("Profile submitted successfully!");
      clearDraft();
      navigate("/dashboard/athlete");
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    }
  };

  const age = athlete.birthdate ? differenceInYears(new Date(), new Date(athlete.birthdate)) : null;
  const sportLabel = sports.find(s => s.id === athlete.sport_id)?.name;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconProps={{ sx: { color: 'primary.main' } }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step panels */}
      {activeStep === 0 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="First Name" name="first_name" fullWidth value={athlete.first_name} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Last Name" name="last_name" fullWidth value={athlete.last_name} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birthdate"
                value={athlete.birthdate}
                onChange={(newValue) => setAthlete(prev => ({ ...prev, birthdate: newValue }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Birthplace" name="birthplace" fullWidth value={athlete.birthplace} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField label="Nationality" name="nationality" fullWidth value={athlete.nationality} onChange={handleChange} />
          </Grid>
        </Grid>
      )}

      {activeStep === 1 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Height (cm)" name="height_cm" type="number" fullWidth value={athlete.height_cm} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Weight (kg)" name="weight_kg" type="number" fullWidth value={athlete.weight_kg} onChange={handleChange} />
          </Grid>
        </Grid>
      )}

      {activeStep === 2 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label="Sport" name="sport_id" fullWidth value={athlete.sport_id} onChange={handleChange}>
              {sports.map(({sport: {id, name}}) =>     <MenuItem key={id} value={id}>
                {name}
              </MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label="Position" name="position" fullWidth value={athlete.position} onChange={handleChange}>
              {positions.map((p, i) => <MenuItem key={i} value={p.name}>{p.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Preferred Side" name="pr"/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Club Team" name="club_team" fullWidth value={athlete.club_team} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Debut Year" name="debut_year" type="number" fullWidth value={athlete.debut_year} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Caps" name="caps" type="number" fullWidth value={athlete.caps} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Points" name="points" type="number" fullWidth value={athlete.points} onChange={handleChange} />
          </Grid>
        </Grid>
      )}

      {activeStep === 3 && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6">Review Your Profile</Typography>
          <Typography>Name: {athlete.first_name} {athlete.last_name}</Typography>
          <Typography>Birthdate: {athlete.birthdate ? format(new Date(athlete.birthdate), 'PPP') : '—'} ({age ? age + ' yrs' : 'N/A'})</Typography>
          <Typography>Height: {athlete.height_cm} cm</Typography>
          <Typography>Weight: {athlete.weight_kg} kg</Typography>
          <Typography>Sport: {sportLabel}</Typography>
          <Typography>Position: {athlete.position}</Typography>
          <Typography>Preferred Side: {athlete.preferred_side}</Typography>
          <Typography>Club/Team: {athlete.club_team}</Typography>
          <Typography>Achievements: {athlete.achievements.join(', ')}</Typography>
          <Typography>Social Links: {athlete.social_links.join(', ')}</Typography>
          <Typography>Public Profile: {athlete.show_public ? 'Yes' : 'No'}</Typography>
        </Paper>
      )}

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>Next</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Profile</Button>
        )}
        <Button onClick={clearDraft} sx={{ color: 'secondary.main' }}>Clear Draft</Button>
      </Box>
    </Container>
  );
};

export default AthleteForm;
