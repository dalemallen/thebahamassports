import { Grid, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useState } from "react";
import RosterCard from "./RosterCard";

export default function Roster({
  data = [],
  title = "Roster",
  showNumbers = true,
  linkToProfile = true,
  role = "athletes", // or "coach"
  emptyMessage = "No roster members found.",
}) {
  const [filter, setFilter] = useState("");

  const filteredData = filter
    ? data.filter((d) => d.position?.toLowerCase() === filter)
    : data;

  const uniquePositions = [...new Set(data.map((d) => d.position).filter(Boolean))];

  return (
    <>
      
      {uniquePositions.length > 1 && (
        <FormControl sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel>Filter by Position</InputLabel>
          <Select
            value={filter}
            label="Filter by Position"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="">All Positions</MenuItem>
            {uniquePositions.map((pos) => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Grid container spacing={2}>
        {filteredData.length > 0 ? (
          filteredData.map((athletes) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={athletes.user_id+athletes.name}>
              <RosterCard athletes={athletes} linkToProfile={linkToProfile} />
            </Grid>
          ))
        ) : (
          <Typography>{emptyMessage}</Typography>
        )}
      </Grid>
    </>
  );
}
