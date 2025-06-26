import { Card, CardContent, Typography, Avatar, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RosterCard({ player, linkToProfile = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkToProfile) {
      navigate(`/players/${player.user_id}`);
    }
  };

  return (
    <Card sx={{ cursor: linkToProfile ? "pointer" : "default" }} onClick={handleClick}>
      <CardContent sx={{ textAlign: "center" }}>
        <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 1 }}>
          {player.first_name?.[0] || "?"}
        </Avatar>
        <Typography variant="body1">
          {player.first_name} {player.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {player.position} {player.jersey_number ? `#${player.jersey_number}` : ""}
        </Typography>

        <Box sx={{ mt: 1 }}>
          {player.is_captain && <Chip label="Captain" size="small" color="primary" sx={{ mr: 1 }} />}
          {player.is_mvp && <Chip label="MVP" size="small" color="secondary" />}
        </Box>
      </CardContent>
    </Card>
  );
}
