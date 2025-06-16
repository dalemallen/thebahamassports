import { useState, useEffect } from "react";
import { useProfile } from "../../context/ProfileContext";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";

const positionOptions = {
  soccer: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
  basketball: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  rugby: ["Prop", "Hooker", "Lock", "Flanker", "Scrum-half", "Fly-half", "Center", "Wing", "Fullback"],
  track: ["Sprinter", "Middle Distance", "Long Distance", "Hurdler", "Jumper", "Thrower"],
  // Add more sports as needed
};

export default function AthleteForm({ selectedSport = "soccer" }) {
  const { user } = useProfile();
  const [formData, setFormData] = useState({
    birthdate: "",
    birthplace: "",
    height_cm: "",
    weight_kg: "",
    position: "",
    club_team: "",
    debut_year: "",
    caps: "",
    points: "",
    achievements: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      user_id: user?.sub,
      sport: selectedSport,
    };

    try {
      const res = await fetch("/api/onboard/athlete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to onboard athlete");

      window.location.href = "/dashboard/athlete";
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        🏅 Athlete Onboarding
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="birthdate"
            label="Birthdate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="birthplace"
            label="Birthplace"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="height_cm"
            label="Height (cm)"
            type="number"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="weight_kg"
            label="Weight (kg)"
            type="number"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            name="position"
            label="Position"
            fullWidth
            onChange={handleChange}
            value={formData.position}
          >
            {(positionOptions[selectedSport] || []).map((pos) => (
              <MenuItem key={pos} value={pos}>
                {pos}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="club_team"
            label="Club/Team"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="debut_year"
            label="Debut Year"
            type="number"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="caps"
            label="Caps"
            type="number"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            name="points"
            label="Points"
            type="number"
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <TextField
            name="achievements"
            label="Achievements"
            multiline
            rows={3}
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
