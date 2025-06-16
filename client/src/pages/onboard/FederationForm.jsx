
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageUpload from "../../components/common/ImageUpload";

const FederationForm = () => {
  const [federation, setFederation] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [formData, setFormData] = useState({
    federationId: "",
    federationName: "",
    description: "",
    logo: null,
    coverImage: null,
  });

  useEffect(() => {
    const fetchFederation = async () => {
      try {
        const res = await axios.get("/api/federations/me");
        setFederation(res.data);
        setFormData({
          federationId: res.data.id,
          federationName: res.data.name,
          description: "",
          logo: null,
          coverImage: null,
        });
      } catch (err) {
        console.error("Failed to load federation data", err);
      }
    };

    fetchFederation();
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
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={2}>
      <Typography variant="h5" mb={2}>
        Federation Onboarding
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="federationId"
            label="Federation ID"
            fullWidth
            value={formData.federationId}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="federationName"
            label="Federation Name"
            fullWidth
            value={formData.federationName}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="description"
            label="Federation Description"
            fullWidth
            multiline
            minRows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ImageUpload
            name="logo"
            label="Upload Logo"
            onChange={handleChange}
            preview={logoPreview}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ImageUpload
            name="coverImage"
            label="Upload Cover Image (Premium)"
            onChange={handleChange}
            preview={coverPreview}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            Submit Federation Info
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FederationForm;
