// TeamStatsPanel.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import axios from "axios";

const TeamStatsPanel = ({ teamId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/teams/${teamId}/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching team stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [teamId]);

  if (loading) return <CircularProgress />;
  if (!stats) return <Typography>No stats available</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Team Statistics</Typography>
        {Object.entries(stats).map(([label, value]) => (
          <Typography key={label}>{label}: {value}</Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamStatsPanel;