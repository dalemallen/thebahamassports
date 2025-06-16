import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Button, Drawer,
  List, ListItem, ListItemText, Box, Menu, MenuItem, useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import icon from '../../assets/icon.png';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../context/AuthContext";



export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuType, setMenuType] = useState("");
    const { user, isAuthenticated } = useAuth();

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const handleMenuOpen = (event, type) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuType("");
  };

  const sports = [
    "Basketball", "Football", "Track & Field", "Volleyball", "Baseball", "Softball", "Rugby", "Swimming",
    "Soccer", "Tennis", "Boxing", "Cycling", "Cricket", "Golf", "Judo", "Karate", "Sailing",
    "Shooting", "Table Tennis", "Taekwondo", "Triathlon", "Weightlifting", "Wrestling", "Gymnastics"
  ];

  const dropdowns = {
    Features: [
      { label: "Registration & Payment", path: "/features/registration" },
      { label: "Scheduling", path: "/features/scheduling" },
      { label: "Fundraising", path: "/features/fundraising" },
      { label: "Website Builder", path: "/features/website" },
      { label: "Athlete Profiles", path: "/features/profiles" },
      { label: "Team & League Management", path: "/features/management" },
    ],
    Accounts: [
      { label: "Athletes", path: "/accounts/athletes" },
      { label: "Teams", path: "/accounts/teams" },
      { label: "Coaches", path: "/accounts/coaches" },
      { label: "Sponsors", path: "/accounts/sponsors" },
      { label: "Scouts", path: "/accounts/scouts" },
    ],
    Events: [
      { label: "Leagues", path: "/leagues" },
      { label: "Tournaments", path: "/tournaments" },
      { label: "Interschool", path: "/events/interschool" },
    ],
    Company: [
      { label: "About Us", path: "/company/about" },
      { label: "Contact Us", path: "/company/contact" },
    ]
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}
        >
          {/* TheBahamasSports */}
          <img src={icon} alt="App Icon" style={{ width: 80, height: 80 }} />

        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box sx={{ width: 260, p: 2 }}>
                <List>
                  <ListItem button component={Link} to="/federations" onClick={toggleDrawer(false)}>
                    <ListItemText primary="Sports" />
                  </ListItem>
                  {sports.map((sport) => (
                    <ListItem
                      key={sport}
                      button
                      component={Link}
                      to={`/federations/${sport.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={toggleDrawer(false)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={sport} />
                    </ListItem>
                  ))}
                  {Object.entries(dropdowns).map(([label, items]) => (
                    <React.Fragment key={label}>
                      <ListItem><ListItemText primary={label} /></ListItem>
                      {items.map((item) => (
                        <ListItem
                          key={item.label}
                          button
                          component={Link}
                          to={item.path}
                          onClick={toggleDrawer(false)}
                          sx={{ pl: 4 }}
                        >
                          <ListItemText primary={item.label} />
                        </ListItem>
                      ))}
                    </React.Fragment>
                  ))}
                  <ListItem button component={Link} to="/login"><ListItemText primary="Login" /></ListItem>
                  <ListItem button component={Link} to="/signup"><ListItemText primary="Sign Up" /></ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={Link} to="/federations" color="inherit">Sports</Button>
            <Button color="inherit" onClick={(e) => handleMenuOpen(e, "Features")}>Features</Button>
            <Button color="inherit" onClick={(e) => handleMenuOpen(e, "Accounts")}>Accounts</Button>
            <Button color="inherit" onClick={(e) => handleMenuOpen(e, "Events")}>Events</Button>
            <Button color="inherit" onClick={(e) => handleMenuOpen(e, "Company")}>Company</Button>
            <Button component={Link} to="/pricing" color="inherit">Pricing</Button>
            {isAuthenticated ? (
               <LogoutButton/>
            ) :      <LoginButton/>}
     
            <Button component={Link} to="/signup" variant="contained" color="primary">Sign Up</Button>
          </Box>
        )}
      </Toolbar>

      {/* Dropdown Menus (Desktop Only) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{ onMouseLeave: handleMenuClose }}
      >
        {menuType === "Features" && dropdowns.Features.map((item) => (
          <MenuItem key={item.label} component={Link} to={item.path} onClick={handleMenuClose}>
            {item.label}
          </MenuItem>
        ))}
        {menuType === "Accounts" && dropdowns.Accounts.map((item) => (
          <MenuItem key={item.label} component={Link} to={item.path} onClick={handleMenuClose}>
            {item.label}
          </MenuItem>
        ))}
        {menuType === "Events" && dropdowns.Events.map((item) => (
          <MenuItem key={item.label} component={Link} to={item.path} onClick={handleMenuClose}>
            {item.label}
          </MenuItem>
        ))}
        {menuType === "Company" && dropdowns.Company.map((item) => (
          <MenuItem key={item.label} component={Link} to={item.path} onClick={handleMenuClose}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
