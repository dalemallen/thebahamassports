import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../../context/UserContext";

const ScoutForm = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone_number: "",
    organization: "",
    sport_focus: "",
    experience_years: "",
    profile_photo: null,
    portfolio_link: "",
    bio: "",
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
    console.log("Scout Onboarding Data:", formData);
    // TODO: Send to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Scout Onboarding
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
            disabled
            fullWidth
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

        <Grid size={{ xs: 12, sm: 6}} >
          <TextField
            label="Organization / Club"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md:3}} >
          <TextField
            label="Sport Focus"
            name="sport_focus"
            value={formData.sport_focus}
            onChange={handleChange}
            placeholder="e.g. Football, Track"
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 , md:3}} >
          <TextField
            type="number"
            label="Years of Experience"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Portfolio or Website (optional)"
            name="portfolio_link"
            value={formData.portfolio_link}
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

        <Grid size={{ xs: 12  }}>
          <TextField
            label="Short Bio (optional)"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12  }}>
          <Button type="submit" variant="contained" color="primary">
            Complete Onboarding
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ScoutForm;
