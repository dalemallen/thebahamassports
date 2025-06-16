import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const TeamForm = () => {
  const [formData, setFormData] = useState({
    teamName: "",
    federationId: "",
    location: "",
    ageGroup: "",
    gender: "",
    coachName: "",
    logo: null,
    coverImage: null,
  });

  const [sports, setSports] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await axios.get("/api/sports");
        setSports(res.data);
      } catch (err) {
        console.error("Error loading sports", err);
      }
    };
    fetchSports();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      const previewURL = URL.createObjectURL(file);
      if (name === "logo") setLogoPreview(previewURL);
      if (name === "coverImage") setCoverPreview(previewURL);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // handle form submission
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={2}>
      <Typography variant="h5" mb={2}>
        Team Onboarding
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="teamName"
            label="Team Name"
            fullWidth
            value={formData.teamName}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="federationId"
            label="Sport / Federation"
            select
            fullWidth
            value={formData.federationId}
            onChange={handleChange}
            required
          >
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.federation.id}>
                {sport.name} — {sport.federation.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="location"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="coachName"
            label="Coach Name"
            fullWidth
            value={formData.coachName}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="ageGroup"
            label="Age Group"
            fullWidth
            value={formData.ageGroup}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="gender"
            label="Team Gender"
            select
            fullWidth
            value={formData.gender}
            onChange={handleChange}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Mixed">Mixed</MenuItem>
          </TextField>
        </Grid>

        {/* Logo Upload */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Logo
            <input
              type="file"
              name="logo"
              accept="image/*"
              hidden
              onChange={handleChange}
            />
          </Button>
          {logoPreview && (
            <Box mt={1}>
              <Avatar src={logoPreview} alt="Logo Preview" sx={{ width: 80, height: 80 }} />
            </Box>
          )}
        </Grid>

        {/* Cover Upload */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Cover Image (Premium)
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              hidden
              onChange={handleChange}
            />
          </Button>
          {coverPreview && (
            <Box mt={1}>
              <img
                src={coverPreview}
                alt="Cover Preview"
                style={{ width: "100%", maxHeight: 150, objectFit: "cover" }}
              />
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12  }}>
          <Button type="submit" variant="contained" fullWidth>
            Submit Team Info
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamForm;
