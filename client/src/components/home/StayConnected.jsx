import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";

export default function StayConnected() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: 10,
        px: 3,
        backgroundColor: "#F6F8FA",
        borderTop: `4px solid ${theme.palette.secondary.main}`,
        textAlign: "center",
      }}
    >
      <Box
        maxWidth="md"
        mx="auto"
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          Stay in the Game
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 5, maxWidth: 500, mx: "auto" }}
        >
          Get the latest updates on leagues, athletes, and upcoming events across The Bahamas.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            type="email"
            sx={{
              width: { xs: "100%", sm: 350 },
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#0086be",
              },
            }}
          >
            Subscribe
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
