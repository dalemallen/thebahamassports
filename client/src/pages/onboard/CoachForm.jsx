import { useState } from "react";
import { useUser } from "../../context/AuthContext";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";

const coachingLevels = ["Youth", "High School", "College", "Professional"];
const sportsList = ["Soccer", "Basketball", "Rugby", "Track", "Tennis"]; // Customize as needed

export default function CoachForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    sport: "",
    coaching_level: "",
    team_name: "",
    years_experience: "",
    certifications: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      user_id: user?.sub,
    };

    try {
      const res = await fetch("/api/onboard/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to onboard coach");

      window.location.href = "/dashboard/coach";
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        🧢 Coach Onboarding
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            name="sport"
            label="Sport"
            fullWidth
            onChange={handleChange}
            value={formData.sport}
          >
            {sportsList.map((sport) => (
              <MenuItem key={sport} value={sport}>
                {sport}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            name="coaching_level"
            label="Coaching Level"
            fullWidth
            onChange={handleChange}
            value={formData.coaching_level}
          >
            {coachingLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="team_name"
            label="Team Name"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="years_experience"
            label="Years of Experience"
            type="number"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="certifications"
            label="Certifications (comma separated)"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
