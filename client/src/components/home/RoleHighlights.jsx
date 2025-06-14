import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";

const roles = {
  Athlete: "Create your profile and get scouted.",
  Coach: "Manage teams and track performance.",
  Federation: "Host events, manage national teams.",
  School: "Run interschool competitions.",
  Organizer: "Plan tournaments and leagues."
};

export default function RoleHighlights() {
  const [tab, setTab] = useState("Athlete");

  return (
    <Box sx={{ py: 6 }}>
      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        {Object.keys(roles).map(role => (
          <Tab label={role} value={role} key={role} />
        ))}
      </Tabs>
      <Typography align="center" sx={{ mt: 3 }}>{roles[tab]}</Typography>
    </Box>
  );
}
