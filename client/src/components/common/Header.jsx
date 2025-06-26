import React, { useEffect, useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Grid,
  Container,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  ClickAwayListener,
  Grow,
  Paper, 
  Avatar, 
  Menu,
  MenuItem
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import LoginButton from './LoginButton';  
import LogoutButton from './LogoutButton'
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeLabel, setActiveLabel] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();
  const dropdownRef = useRef(null);

    const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    const fetchNavItems = async () => {
      const staticNav = [
        {
          label: 'Competition',
          children: [
            { label: 'Schedule', path: '/schedule' },
            { label: 'Tournaments', path: '/tournaments' },
            { label: 'Leagues', path: '/leagues' },
            { label: '1-Day Events', path: '/events/one-day' },
            { label: 'Tryouts', path: '/tryouts' }
          ]
        },
        {
          label: 'Discover',
          children: [
            { label: 'Players', path: '/players' },
            { label: 'Teams', path: '/teams' },
            // { label: 'Top Performers', path: '/top-performers' },
          ]
        },
        // {
        //   label: 'Watch',
        //   children: [
        //     { label: 'Highlights', path: '/highlights' },
        //     { label: 'Interviews', path: '/interviews' },
        //     { label: 'Training Clips', path: '/training-clips' },
        //     { label: 'Athlete Spotlights', path: '/spotlights' }
        //   ]
        // },
        // {
        //   label: 'Updates',
        //   children: [
        //     { label: 'Federation Updates', path: '/updates/federation' },
        //     { label: 'Athlete Announcements', path: '/updates/athletes' },
        //     { label: 'Scholarships & Sponsorships', path: '/updates/opportunities' }
        //   ]
        // },
        // {
        //   label: 'Sponsors',
        //   children: [
        //     { label: 'Sponsorships', path: '/sponsors/opportunities' },
        //     { label: 'Sponsor Accounts', path: '/sponsors/accounts' },
        //     { label: 'Scholarships', path: '/sponsors/scholarships' }
        //   ]
        // },
        // {
        //   label: 'Accounts',
        //   children: [
        //     { label: 'Athlete', path: '/accounts/athlete' },
        //     { label: 'Team', path: '/accounts/team' },
        //     { label: 'Coach', path: '/accounts/coach' },
        //     { label: 'Parent', path: '/accounts/parent' },
        //     { label: 'Sponsor', path: '/accounts/sponsor' },
        //     { label: 'Organization', path: '/accounts/organization' }
        //   ]
        // },
        {
          label: 'Info Hub',
          children: [
            { label: 'About Us', path: '/aboutus' },
            { label: 'FAQ', path: '/faq' }
          ]
        },
        { label: 'Contact', path: '/contact' }
      ];

      let sports = [];
      try {
        const { data } = await axios.get('/api/sports/with-federations');

        const sports = data.map(({ sport: { id, name } }) => ({
     
          label: name,
          path: `/sports/${id}`,
        }));
      } catch (err) {
        console.error('Failed to fetch sports:', err);
        sports = [];
      }

      setNavItems([{ label: 'Home', path: '/' }, { label: 'Sports', children: sports }, ...staticNav]);
    };

    fetchNavItems();
  }, []);

  const handleDropdown = (item) => {
    setActiveDropdown((prev) => (prev === item.label ? null : item.label));
    setMenuItems(item.children);
    setActiveLabel(item.label);
  };

  const handleClickAway = () => {
    setActiveDropdown(null);
    setMenuItems([]);
    setActiveLabel('');
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <AppBar position="sticky" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 'none' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              The Bahamas
            </Typography>
            {isMobile ? (
              <IconButton edge="end" color="inherit" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              navItems.map((item) => (
                <Box key={item.label}>
                  {item.children ? (
                    <Button
                      onClick={() => handleDropdown(item)}
                      sx={{
                        color: activeDropdown === item.label ? 'primary.main' : '#000',
                        fontWeight: 500,
                        textTransform: 'none'
                      }}
                      endIcon={<ArrowDropDownIcon />}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      href={item.path}
                      sx={{
                        color: location.pathname === item.path ? 'primary.main' : '#000',
                        fontWeight: 500,
                        textTransform: 'none'
                      }}
                    >
                      {item.label}
                    </Button>
                  )}
                </Box>
              ))
            )}
            {!isMobile && (
     <>{isAuthenticated ? (
        <>
          <Avatar
            src={user.picture}
            alt={user.name}
            onClick={handleAvatarClick}
            sx={{ cursor: 'pointer', ml: 2 }}
          />
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem disabled>{user.name}</MenuItem>
            <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
<>
        <Button
          variant="contained"
          onClick={() => loginWithRedirect()}
          sx={{ ml: 2 }}
        >
          Log In / Sign Up
        </Button>
          <Button
  variant="contained"
  onClick={() =>
    loginWithRedirect({
      appState: { role: "team" },
      authorizationParams: {
        redirect_uri: window.location.origin + "/callback",
      },
    })
  }
  sx={{ ml: 2 }}
>
team log in / sign up
</Button>
<Button
  variant="contained"
  onClick={() => {
    sessionStorage.setItem("pendingRole", "federation");
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin + "/redirect-handler",
      },
    });
  }}
>
  Federation Login / Signup
</Button>
</>
      )}</>
            )}
          </Toolbar>
        </AppBar>

        <Grow in={Boolean(activeDropdown)} timeout={250} unmountOnExit>
          <Box sx={{ bgcolor: '#fff', py: 3, pl: 3,  }}>
            <Container>
              <Grid container spacing={2} columns={5}>
                {menuItems.map((item, index) => (
                  <Grid item xs={1} key={index}>
                    <Button
                      href={item.path}
                      fullWidth
                      sx={{ justifyContent: 'flex-start', color: '#000', textTransform: 'none' }}
                    >
                      {item.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </Grow>

        <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <List sx={{ width: 250 }}>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.label}
                component="a"
                href={item.path || '#'}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
                <>{isAuthenticated ? (
        <>
          <Avatar
            src={user.picture}
            alt={user.name}
            onClick={handleAvatarClick}
            sx={{ cursor: 'pointer', ml: 2 }}
          />
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem disabled>{user.name}</MenuItem>
            <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Logout</MenuItem>
          </Menu>
        </>
      ) : (<>
        <Button
          variant="contained"
          onClick={() => loginWithRedirect()}
          sx={{ ml: 2 }}
        >
          Log In / Sign Up
        </Button>
        <Button
  variant="contained"
  onClick={() =>
    loginWithRedirect({
      appState: { role: "team" },
      authorizationParams: {
        redirect_uri: window.location.origin + "/callback",
      },
    })
  }
  sx={{ ml: 2 }}
>
team log in / sign up
</Button>
<Button
  variant="contained"
  onClick={() =>
    loginWithRedirect({
      appState: { role: "federation" },
      authorizationParams: {
        redirect_uri: window.location.origin + "/callback",
      },
    })
  }
  sx={{ ml: 2 }}
>
federation log in / sign up
</Button>
</>
      )}</>
       
          </List>
        </Drawer>
      </Box>
    </ClickAwayListener>
  );
};

export default Header;
