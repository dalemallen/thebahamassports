import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../../context/AuthContext";

const ParentForm = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone_number: "",
    relation_to_athlete: "",
    athlete_name: "",
    athlete_dob: "",
    address: "",
    profile_photo: null,
    emergency_contact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profile_photo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Guardian Onboarding Data:", formData);
    // TODO: Send to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Guardian Onboarding
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            fullWidth
            disabled
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Relation to Athlete"
            name="relation_to_athlete"
            value={formData.relation_to_athlete}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. Mother, Uncle, Guardian"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Athlete's Full Name"
            name="athlete_name"
            value={formData.athlete_name}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="date"
            label="Athlete's Date of Birth"
            name="athlete_dob"
            value={formData.athlete_dob}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Emergency Contact Number"
            name="emergency_contact"
            value={formData.emergency_contact}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Profile Photo
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Grid>

        <Grid size={{ xs:12 }}>
          <Button type="submit" variant="contained" color="primary">
            Complete Onboarding
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ParentForm;
