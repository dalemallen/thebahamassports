// src/components/layout/Header.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSport } from "../../context/SportsContext";

const sportsList = [
  "rugby", "soccer", "basketball", "swimming", "tennis", "track and field",
  "volleyball", "baseball", "boxing", "cycling", "fencing", "golf", "gymnastics",
  "handball", "hockey", "judo", "karate", "sailing", "shooting", "softball",
  "taekwondo", "table tennis", "weightlifting", "wrestling"
];

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Leagues", key: "leagues" },
  { label: "Tournaments", key: "tournaments" },
  { label: "Federations", key: "federations" },
  { label: "Teams", key: "teams" },
  { label: "Players", key: "players" },
  { label: "Schedule", key: "schedule" },
  { label: "Events", key: "events" },
  { label: "Login", path: "/login" },
];

export default function Header() {
  const { sport, setSport } = useSport();
  const [sportAnchorEl, setSportAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const openSportMenu = (e) => setSportAnchorEl(e.currentTarget);
  const closeSportMenu = () => setSportAnchorEl(null);

  const changeSport = (selectedSport) => {
    setSport(selectedSport);
    navigate(`/sports?sport=${selectedSport}`);
    closeSportMenu();
  };

  const handleNavClick = (link) => {
    if (link.path) navigate(link.path);
    else navigate(`/${link.key}?sport=${sport}`);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#000" }}>
      <Toolbar>
        {/* Mobile hamburger */}
        <Box sx={{ display: { xs: "block", md: "none" }, mr: 2 }}>
          <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          TheBahamasSports
        </Typography>

        {/* Sport dropdown on desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
          <Button
            color="inherit"
            onClick={openSportMenu}
            startIcon={<SportsSoccerIcon />}
          >
            {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </Button>
          <Menu anchorEl={sportAnchorEl} open={Boolean(sportAnchorEl)} onClose={closeSportMenu}>
            {sportsList.map((s) => (
              <MenuItem key={s} onClick={() => changeSport(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Top nav links on desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {navLinks.map((link) => (
            <Button
              key={link.label}
              color="inherit"
              onClick={() => handleNavClick(link)}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.label}
                onClick={() => {
                  handleNavClick(link);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText primary="Select Sport" />
            </ListItem>
            {sportsList.map((s) => (
              <ListItem
                button
                key={s}
                onClick={() => {
                  changeSport(s);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={s.charAt(0).toUpperCase() + s.slice(1)} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
