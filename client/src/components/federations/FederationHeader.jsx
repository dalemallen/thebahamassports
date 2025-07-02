import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Button,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FederationHeader = ({
  name,
  sportId,
  sports = [],
  handleSportChange,
  tagline = "Empowering Bahamian Athletes",
  logoUrl = "/images/default-logo.png",
  backgroundUrl = "/images/hero.png",
  ctaLabel = "Join Us",
  ctaUrl = "#",
}) => {

  console.log("sports", sports);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "relative",
        color: "white",
        textAlign: "center",
        py: { xs: 6, sm: 8 },
        px: 3,
        mb: 4,
        backgroundImage: `linear-gradient(rgba(0,163,224,0.85), rgba(0,163,224,0.6)), url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: { xs: "none", sm: "block" },
        }}
      >
        <Avatar
          src={logoUrl}
          alt={name}
          sx={{ width: 64, height: 64, border: "2px solid white" }}
        />
      </Box>

      <Typography
        variant={isMobile ? "h5" : "h3"}
        sx={{ fontWeight: 700, textShadow: "1px 1px 4px rgba(0,0,0,0.6)" }}
      >
        {name}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{ textShadow: "1px 1px 4px rgba(0,0,0,0.6)", mt: 1 }}
      >
        {tagline}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={sportId}
            onChange={handleSportChange}
            aria-label="Select sport"
          >
            {sports.map(({sport: {id, name}}) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {ctaLabel && (
          <Button
            href={ctaUrl}
            variant="contained"
            sx={{ backgroundColor: "#FFD100", color: "black" }}
          >
            {ctaLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FederationHeader;