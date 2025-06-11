
import TeamList from "../components/teams/TeamList";
import { Container, Typography } from "@mui/material";

export default function TeamPage() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>Teams</Typography>
      <TeamList />
    </Container>
  );
}
