// TryoutsPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button, List, ListItem } from "@mui/material";

const TryoutsPanel = ({ teamId }) => {
  const [tryouts, setTryouts] = useState([]);
  const [form, setForm] = useState({ tryout_date: "", location: "", age_group: "", notes: "" });

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/tryouts`)
      .then(res => setTryouts(res.data))
      .catch(console.error);
  }, [teamId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios.post(`/api/teams/${teamId}/tryouts`, form)
      .then(res => {
        setTryouts(prev => [...prev, res.data]);
        setForm({ tryout_date: "", location: "", age_group: "", notes: "" });
      })
      .catch(console.error);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Tryouts</Typography>
        <List>
          {tryouts.map((t, i) => (
            <ListItem key={i}>{t.tryout_date} — {t.location} — {t.age_group}</ListItem>
          ))}
        </List>

        <TextField
          label="Date"
          name="tryout_date"
          value={form.tryout_date}
          onChange={handleChange}
          fullWidth sx={{ mt: 2 }}
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          fullWidth sx={{ mt: 2 }}
        />
        <TextField
          label="Age Group"
          name="age_group"
          value={form.age_group}
          onChange={handleChange}
          fullWidth sx={{ mt: 2 }}
        />
        <TextField
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          fullWidth sx={{ mt: 2 }}
        />
        <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>Create Tryout</Button>
      </CardContent>
    </Card>
  );
};

export default TryoutsPanel;