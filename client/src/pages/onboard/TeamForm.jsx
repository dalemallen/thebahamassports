import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";

const TeamForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    federation_Id: "",
    location: "",
    ageGroup: "",
    gender: "",
    coachName: "",
    logo: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {["name", "federation_Id", "location", "ageGroup", "gender"].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              label={field.replace(/([A-Z])/g, " $1")}
              name={field}
              fullWidth
              value={formData[field]}
              onChange={handleChange}
            />
          </Grid>
        ))}
{formData.coachNames.map((coach, index) => (
  <TextField
    key={index}
    label={`Coach ${index + 1}`}
    name="coachNames"
    value={coach}
    onChange={(e) => {
      const newCoaches = [...formData.coachNames];
      newCoaches[index] = e.target.value;
      setFormData((prev) => ({ ...prev, coachNames: newCoaches }));
    }}
    fullWidth
    sx={{ mb: 2 }}
  />
))}

<Button
  onClick={() =>
    setFormData((prev) => ({
      ...prev,
      coachNames: [...prev.coachNames, ""],
    }))
  }
>
  Add Coach
</Button>

        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label" fullWidth>
            Upload Logo
            <input type="file" name="logo" hidden onChange={handleChange} />
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label" fullWidth>
            Upload Cover Image
            <input type="file" name="coverImage" hidden onChange={handleChange} />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            Submit Team
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TeamForm;
