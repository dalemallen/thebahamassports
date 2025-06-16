import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../../context/UserContext";

const SponsorOnboardForm = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    sponsor_name: user?.name || "",
    email: user?.email || "",
    phone_number: "",
    logo: null,
    website: "",
    sponsorship_tier: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sponsor Onboarding Data:", formData);
    // TODO: send to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Sponsor Onboarding
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Sponsor/Company Name"
            name="sponsor_name"
            value={formData.sponsor_name}
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Logo
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Website / Social Media"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Sponsorship Tier"
            name="sponsorship_tier"
            value={formData.sponsorship_tier}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="bronze">Bronze</MenuItem>
            <MenuItem value="silver">Silver</MenuItem>
            <MenuItem value="gold">Gold</MenuItem>
            <MenuItem value="platinum">Platinum</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12  }}>
          <TextField
            label="About / Mission Statement"
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

export default SponsorOnboardForm;
