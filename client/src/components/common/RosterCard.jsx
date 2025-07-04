import { Card, CardContent, Typography, Avatar, Chip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RosterCard({ athlete, linkToProfile = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkToProfile) {
      navigate(`/athletes/${athlete.user_id}`);
    }
  };

  return (
    <Card sx={{ cursor: linkToProfile ? "pointer" : "default" }} onClick={handleClick}>
      <CardContent sx={{ textAlign: "center" }}>
        <Avatar sx={{ width: 64, height: 64, mx: "auto", mb: 1 }}>
          {athlete.first_name?.[0] || "?"}
        </Avatar>
        <Typography variant="body1">
          {athlete.first_name} {athlete.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {athlete.position} {athlete.jersey_number ? `#${athlete.jersey_number}` : ""}
        </Typography>

        <Box sx={{ mt: 1 }}>
          {athlete.is_captain && <Chip label="Captain" size="small" color="primary" sx={{ mr: 1 }} />}
          {athlete.is_mvp && <Chip label="MVP" size="small" color="secondary" />}
        </Box>
      </CardContent>
    </Card>
  );
}
