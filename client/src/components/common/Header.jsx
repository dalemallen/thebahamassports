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
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  ClickAwayListener,
  Grow,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../assets/icon.png';

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNavItems = async () => {
      const staticNav = [
               { label: 'Schedule', path: '/schedule' },
        // {
        //   label: 'Competition',
        //   children: [
        //     { label: 'Schedule', path: '/schedule' },
        //     { label: 'Tournaments', path: '/tournaments' },
        //     { label: 'Leagues', path: '/leagues' },
        //     { label: '1-Day Events', path: '/events/one-day' },
        //     { label: 'Tryouts', path: '/tryouts' }
        //   ]
        // },
        // {
        //   label: 'Discover',
        //   children: [
        //     { label: 'Players', path: '/players' },
        //     { label: 'Teams', path: '/teams' },
        //   ]
        // },
       { label: 'About Us', path: '/aboutus' },
        // {
        //   label: 'Info Hub',
        //   children: [
        //     { label: 'About Us', path: '/aboutus' },
        //     { label: 'FAQ', path: '/faq' }
        //   ]
        // },
        { label: 'Contact', path: '/contact' }
      ];

      try {
        const { data } = await axios.get('/api/sports/with-federations');
        const sports = data.map(({ sport: { id, name } }) => ({
          label: name,
          path: `/sports/${id}`
        }));
        setNavItems([{ label: 'Home', path: '/' }, { label: 'Sports', children: sports }, ...staticNav]);
      } catch (err) {
        console.error('Failed to fetch sports:', err);
        setNavItems([{ label: 'Home', path: '/' }, ...staticNav]);
      }
    };

    fetchNavItems();
  }, []);

  const handleDropdown = (item) => {
    setActiveDropdown(activeDropdown === item.label ? null : item.label);
    setMenuItems(item.children || []);
  };

  const handleClickAway = () => {
    setActiveDropdown(null);
    setMenuItems([]);
  };

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <AppBar position="sticky" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center">
              <img src={logo} alt="The Bahamas Sports" style={{ height: 60 }} />
            </Box>

            {isMobile ? (
              <IconButton edge="end" color="inherit" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box display="flex" alignItems="center" gap={1}>
                {navItems.map((item) => (
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
                ))}

                {isAuthenticated ? (
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
                    {['athlete', 'team', 'federation'].map((role) => (
                      <Button
                        key={role}
                        variant="contained"
                        onClick={() => {
                          sessionStorage.setItem("pendingRole", role);
                          loginWithRedirect({
                            appState: { role },
                            authorizationParams: {
                              redirect_uri: window.location.origin + "/redirect-handler",
                            },
                          });
                        }}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)} Sign Up
                      </Button>
                    ))}
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Dropdown menu on desktop */}
        <Grow in={Boolean(activeDropdown)} timeout={250} unmountOnExit>
          <Box sx={{ bgcolor: '#fff', py: 3 }}>
            <Container>
              <Grid container spacing={2}>
                {menuItems.map((item, idx) => (
                  <Grid size={{xs:12, md:6}} md={3} key={idx}>
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

        {/* Drawer on mobile */}
        <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <Box sx={{ width: 260, p: 2 }}>
            <List>
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
            </List>

            {isAuthenticated ? (
              <>
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  onClick={handleAvatarClick}
                  sx={{ cursor: 'pointer', my: 2 }}
                />
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem disabled>{user.name}</MenuItem>
                  <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {['athlete', 'team', 'federation'].map((role) => (
                  <Button
                    key={role}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => {
                      sessionStorage.setItem("pendingRole", role);
                      loginWithRedirect({
                        appState: { role },
                        authorizationParams: {
                          redirect_uri: window.location.origin + "/redirect-handler",
                        },
                      });
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)} Sign Up
                  </Button>
                ))}
              </>
            )}
          </Box>
        </Drawer>
      </Box>
    </ClickAwayListener>
  );
};

export default Header;
