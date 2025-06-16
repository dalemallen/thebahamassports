import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import ImageUpload from "../../components/common/ImageUpload";
import axios from "axios";

const OrganizerForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    organizationName: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    sportId: "",
    federationId: "",
    logoUrl: "",
    coverImageUrl: "",
  });

  const [sports, setSports] = useState([]);
  const [federations, setFederations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [sportsRes, fedRes] = await Promise.all([
        axios.get("/api/sports"),
        axios.get("/api/federations"),
      ]);
      setSports(sportsRes.data);
      setFederations(fedRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (name, url) => {
    setFormData((prev) => ({ ...prev, [name]: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Organizer Onboarding
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Organization Name"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Sport"
            name="sportId"
            value={formData.sportId}
            onChange={handleChange}
            fullWidth
            required
          >
            {sports.map((sport) => (
              <MenuItem key={sport.id} value={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Federation"
            name="federationId"
            value={formData.federationId}
            onChange={handleChange}
            fullWidth
            required
          >
            {federations.map((fed) => (
              <MenuItem key={fed.id} value={fed.id}>
                {fed.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <ImageUpload
            label="Logo"
            onUpload={(url) => handleImageUpload("logoUrl", url)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ImageUpload
            label="Cover Image (Optional)"
            onUpload={(url) => handleImageUpload("coverImageUrl", url)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            Submit Organizer Details
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrganizerForm;
