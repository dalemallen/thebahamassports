
import TeamsList from "../teams/TeamsList";
import { Container, Typography } from "@mui/material";

export default function TeamsPage() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>Teams</Typography>
      <TeamsList />
    </Container>
  );
}
