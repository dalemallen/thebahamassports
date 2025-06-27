import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Container,
  useTheme,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function UserSpotlight() {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8, backgroundColor: "#FAFAFA" }}>
      <Container maxWidth="md">
        <Card
          elevation={4}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            px: 3,
            py: 4,
            gap: 3,
            borderLeft: `6px solid ${theme.palette.secondary.main}`,
            borderRadius: 3,
          }}
        >
          <Avatar
            src="/placeholder-athlete.jpg" // Replace with athlete image
            alt="Athlete of the Month"
            sx={{ width: 100, height: 100 }}
          />

          <CardContent sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: theme.palette.primary.main, mb: 1 }}
            >
              <StarIcon sx={{ fontSize: 20, color: theme.palette.secondary.main, mr: 1 }} />
              Athlete of the Month
            </Typography>

            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              "TheBahamasSports gave me the chance to shine on a national stage!"
            </Typography>

            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
              – Kaleb R., National Youth Track Finalist
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
