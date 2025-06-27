// TeamHeader.jsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const TeamHeader = ({ team, editable }) => {
  return (
    <Box textAlign="center" mb={3}>
      <Avatar
        // src={team.logo_url}
        // alt={team.name}
        sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
      />
      {/* <Typography variant="h4">{team.name}</Typography> */}
      {editable && <Typography variant="body2">[Edit Images]</Typography>}
    </Box>
  );
};

export default TeamHeader;