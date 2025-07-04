// ContactPage.jsx — React + Material-UI contact page (cleaned + improved)

import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
  Snackbar,
  Alert,
  MenuItem
} from "@mui/material";

const topics = ["General Inquiry", "Support", "Partnership", "Other"];

export default function ContactPage() {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "General Inquiry",
    message: ""
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    setOpen(true);
    setForm({ name: "", email: "", phone: "", topic: "General Inquiry", message: "" });
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, py: 8 }}>
      <Grid container spacing={4} maxWidth="lg" mx="auto">
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: theme.palette.primary.light }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Let’s Connect
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Have questions or ideas? Send us a message and we’ll get back to you shortly.
            </Typography>
            <Typography variant="body2">📞 +1 (242) 555-1234</Typography>
            <Typography variant="body2">✉️ hello@bahamassports.com</Typography>
            <Typography variant="body2">🏝 Nassau, Bahamas</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Topic"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                  >
                    {topics.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2, borderRadius: 3, backgroundColor: theme.palette.primary.main, color: theme.palette.background.default }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%" }}>
          Thank you for contacting us! We’ll be in touch soon.
        </Alert>
      </Snackbar>
    </Box>
  );
}
