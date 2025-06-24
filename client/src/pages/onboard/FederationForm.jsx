import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ImageUpload from "../../components/common/ImageUpload";
import { useAuth0 } from "@auth0/auth0-react";
import debounce from "lodash.debounce";

export default function FederationForm() {
  const { getAccessTokenSilently } = useAuth0();

  const [formData, setFormData] = useState({
    federationId: "",
    federationName: "",
    description: "",
    logo: null,
    coverImage: null,
    president: "",
    secretary: "",
    technicalDirector: "",
    constitution: null,
    codeOfConduct: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFederation = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get("/api/federations/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData((prev) => ({
          ...prev,
          federationId: res.data.id,
          federationName: res.data.name,
          description: res.data.description || "",
        }));
      } catch (err) {
        console.error("Failed to load federation data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFederation();
  }, [getAccessTokenSilently]);

  const autoSave = useCallback(
    debounce(async (updated) => {
      try {
        setSaving(true);
        const token = await getAccessTokenSilently();
        await axios.patch("/api/federations/me", updated, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbarOpen(true);
      } catch (err) {
        console.error("Autosave failed", err);
      } finally {
        setSaving(false);
      }
    }, 1500),
    [getAccessTokenSilently]
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let updated = {};

    if (files) {
      const file = files[0];
      updated[name] = file;

      const previewURL = URL.createObjectURL(file);
      if (name === "logo") setLogoPreview(previewURL);
      if (name === "coverImage") setCoverPreview(previewURL);
    } else {
      updated[name] = value;
    }

    const newData = { ...formData, ...updated };
    setFormData(newData);
    autoSave({ [name]: updated[name] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting final federation form:", formData);
    setSnackbarOpen(true);
  };

  const steps = ["Federation Info", "Branding", "Key Contacts", "Documents"];

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box component="form" onSubmit={handleSubmit} p={3} maxWidth="md" mx="auto">
      <Typography variant="h5" mb={3} fontWeight={600} textAlign="center">
        Federation Onboarding
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {activeStep === 0 && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="federationId"
                label="Federation ID"
                fullWidth
                value={formData.federationId}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="federationName"
                label="Federation Name"
                fullWidth
                value={formData.federationName}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
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
          </>
        )}

        {activeStep === 1 && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                name="logo"
                label="Upload Logo"
                onChange={handleChange}
                preview={logoPreview}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                name="coverImage"
                label="Upload Cover Image (Premium)"
                onChange={handleChange}
                preview={coverPreview}
              />
            </Grid>
          </>
        )}

        {activeStep === 2 && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="president"
                label="President Contact"
                fullWidth
                value={formData.president}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="secretary"
                label="Secretary Contact"
                fullWidth
                value={formData.secretary}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="technicalDirector"
                label="Technical Director Contact"
                fullWidth
                value={formData.technicalDirector}
                onChange={handleChange}
              />
            </Grid>
          </>
        )}

        {activeStep === 3 && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Constitution (PDF)
                <input
                  type="file"
                  name="constitution"
                  hidden
                  onChange={handleChange}
                />
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Code of Conduct
                <input
                  type="file"
                  name="codeOfConduct"
                  hidden
                  onChange={handleChange}
                />
              </Button>
            </Grid>
          </>
        )}

        <Grid size={{ xs: 12 }}>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={() => setActiveStep((prev) => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="contained">
                Submit Federation Info
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={saving ? "Saving..." : "Saved"}
      />
    </Box>
  );
}
