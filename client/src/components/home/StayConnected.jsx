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
        backgroundColor: theme.palette.background.default,
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
        <Typography
          variant="h4"
          fontWeight={800}
          color={theme.palette.primary.main}
          sx={{ mb: 2 }}
        >
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
              bgcolor: theme.palette.common.white,
              borderRadius: theme.shape.borderRadius * 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: theme.shape.borderRadius * 2,
              },
              boxShadow: theme.shadows[1],
            }}
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.common.white,
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[2],
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
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
