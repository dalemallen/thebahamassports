import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

const EventFilters = ({
  sportOptions = [],
  typeOptions = [],
  sport,
  eventType,
  onSportChange,
  onTypeChange,
}) => {
  return (
    <Grid container spacing={2} sx={{ my: 2 }}>
      <Grid size={{xs:12 , md:6}}>
        <FormControl fullWidth>
          <InputLabel>Filter by Sport</InputLabel>
          <Select
            value={sport}
            label="Filter by Sport"
            onChange={(e) => onSportChange(e.target.value)}
          >
            {sportOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid size={{xs:12 , md:6}}>
        <FormControl fullWidth>
          <InputLabel>Filter by Event Type</InputLabel>
          <Select
            value={eventType}
            label="Filter by Event Type"
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {typeOptions.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default EventFilters;
