// Full Enhanced MySportsPage with branding, layout spacing, hover effects, and role-based components
import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress
} from "@mui/material";

const mockSports = {
  athlete: [
    {
      id: 1,
      sport: "Rugby",
      federation: "Bahamas Rugby Federation",
      logo: "/images/rugby.png",
      team: "Nassau Warriors",
      coach: "Coach Thompson",
      nextEvent: "July 10 – Nassau Stadium",
    },
    {
      id: 2,
      sport: "Track & Field",
      federation: "Bahamas Athletics Association",
      logo: "/images/track.png",
      team: "Speed Demons",
      coach: "Coach Taylor",
      nextEvent: "July 14 – Robinson Stadium",
    },
  ],
  coach: [
    {
      id: 3,
      sport: "Basketball",
      federation: "Bahamas Basketball Federation",
      logo: "/images/basketball.png",
      team: "Downtown Hoopers",
      athleteCount: 12,
      topAthletes: ["Chris Bain", "Malik Rolle", "DeAndre Stubbs"],
      nextGame: "July 12 – National Gymnasium",
    },
    {
      id: 4,
      sport: "Soccer",
      federation: "Bahamas Soccer Federation",
      logo: "/images/soccer.png",
      team: "Island Strikers",
      athleteCount: 18,
      topAthletes: ["Troy Dean", "Kymani Smith", "Leo Moss"],
      nextGame: "July 15 – Queen Elizabeth Stadium",
    },
  ],
  federation: [
    {
      id: 5,
      sport: "Swimming",
      federation: "Bahamas Swimming Federation",
      logo: "/images/swimming.png",
      teamCount: 8,
      athleteTotal: 76,
      eventsHosted: 4,
      nextEvent: "National Swim Meet – July 18",
    },
    {
      id: 6,
      sport: "Tennis",
      federation: "Bahamas Tennis Federation",
      logo: "/images/tennis.png",
      teamCount: 5,
      athleteTotal: 34,
      eventsHosted: 2,
      nextEvent: "Island Open – July 20",
    },
  ],
};

const upcomingEvents = [
  "July 3 – Beach Soccer Qualifiers",
  "July 6 – National Rugby Friendly",
  "July 8 – Federation Coaches Meeting",
];

const onboardingProgress = 70;
const role = "athlete";

const MySportsPage = () => {
  const data = mockSports[role];

  const renderCardContent = (item) => {
    if (role === "athlete") {
      return (
        <>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Team:</strong> {item.team}</Typography>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Coach:</strong> {item.coach}</Typography>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Next Event:</strong> {item.nextEvent}</Typography>
        </>
      );
    }
    if (role === "coach") {
      return (
        <>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Team:</strong> {item.team}</Typography>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Athletes:</strong> {item.athleteCount}</Typography>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Next Game:</strong> {item.nextGame}</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "black" }}><strong>Top Athletes:</strong></Typography>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {item.topAthletes.map((name, idx) => (
              <li key={idx} style={{ color: "black", fontSize: 13 }}>{name}</li>
            ))}
          </ul>
        </>
      );
    }
    if (role === "federation") {
      return (
        <>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Total Teams:</strong> {item.teamCount}</Typography>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Total Athletes:</strong> {item.athleteTotal}</Typography>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Events Hosted:</strong> {item.eventsHosted}</Typography>
          <Typography variant="body2" sx={{ color: "black" }}><strong>Next Event:</strong> {item.nextEvent}</Typography>
        </>
      );
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "black", fontWeight: 700 }}>
        My Sports
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Filter by Sport</InputLabel>
            <Select defaultValue="All">
              <MenuItem value="All">All</MenuItem>
              {data.map((item) => (
                <MenuItem key={item.id} value={item.sport}>{item.sport}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {role === "athlete" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "black" }}>
            Onboarding Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={onboardingProgress}
            sx={{ height: 10, borderRadius: 5, backgroundColor: '#eee', '& .MuiLinearProgress-bar': { backgroundColor: '#00A3E0' } }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: "black" }}>{onboardingProgress}% complete</Typography>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "black" }}>Upcoming Events</Typography>
        <List>
          {upcomingEvents.map((event, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={event} primaryTypographyProps={{ style: { color: "black" } }} />
              </ListItem>
              {index < upcomingEvents.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.2s ease",
                '&:hover': {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                }
              }}
            >
              <CardHeader
                avatar={<Avatar src={item.logo} alt={item.sport} />}
                title={item.sport}
                subheader={item.federation}
                action={<Chip label={role.charAt(0).toUpperCase() + role.slice(1)} sx={{ backgroundColor: '#FFD100', color: 'black' }} size="small" />}
                titleTypographyProps={{ sx: { color: "black", fontWeight: 600 } }}
                subheaderTypographyProps={{ sx: { color: "black" } }}
              />
              <CardContent sx={{ flexGrow: 1 }}>{renderCardContent(item)}</CardContent>
              <CardActions sx={{ mt: "auto", p: 2 }}>
                <Button size="small" variant="outlined" sx={{ color: "#00A3E0", borderColor: "#00A3E0" }}>View Schedule</Button>
                <Button size="small" variant="contained" sx={{ backgroundColor: "#00A3E0" }}>View Stats</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MySportsPage;
