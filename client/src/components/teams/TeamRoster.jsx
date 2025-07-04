// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Roster from "../common/Roster";
// import { Box, CircularProgress, Typography } from "@mui/material";

// const TeamRoster = ({ teamId }) => {
//   const [athletes, setPlayers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRoster = async () => {
//       try {
//         const res = await axios.get(`/api/teams/${teamId}/athletes`);
//         setPlayers(res.data);
//       } catch (err) {
//         console.error("Failed to load team roster:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (teamId) fetchRoster();
//   }, [teamId]);

//   if (loading) return <CircularProgress sx={{ my: 2 }} />;
//   if (!athletes.length) return <Typography>No athletes found.</Typography>;

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Roster data={athletes} title="Team Roster" />
//     </Box>
//   );
// };

// export default TeamRoster;


// TeamRoster.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const TeamRoster = ({ teamId }) => {
  const [athletes, setPlayers] = useState([]);

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/roster`).then((res) => setPlayers(res.data)).catch(console.error);
  }, [teamId]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Team Roster</Typography>
        <List>
          {athletes.map((athletes) => (
            <ListItem key={athletes.id}>{athletes.first_name} {athletes.last_name} — {athletes.position}</ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TeamRoster;