// src/pages/FederationDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';
import PlayersGrid from '../../components/federations/PlayersGrid';
import FederationStats from '../../components/federations/FederationStats';
import TeamsGrid from '../../components/federations/TeamsGrid';
import FederationHeader from '../../components/federations/FederationHeader';
import UpcomingEvents from '../../components/common/UpcomingEvents';
import MediaCarousel from '../../components/federations/MediaCarousel';
import WeeklySummary from '../../components/federations/WeeklySummary';

const FederationDetails = () => {
  const { sportId } = useParams();
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [federation, setFederation] = useState(null);
  const [topAthletes, setTopAthletes] = useState([]);
  console.log('topAthletes: ', topAthletes);
  const [events, setEvents] = useState([]);
  console.log('events: ', events);
  const [weeklySummary, setWeeklySummary] = useState(null);
  console.log('weeklySummary: ', weeklySummary);
  const [mediaHighlights, setMediaHighlights] = useState([]);
  console.log('mediaHighlights: ', mediaHighlights);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportsRes = await axios.get('/api/sports');
        setSports(sportsRes.data);

        const federationRes = await axios.get(`/api/federations/by-sport/${sportId}`);
        console.log('federationRes: ', federationRes);
        const fedData = federationRes.data;
        setFederation(fedData);

        if (fedData?.id) {
          const [topAthletesRes, eventsRes, summaryRes, highlightsRes] = await Promise.all([
            axios.get(`/api/athletes/top?sportId=${sportId}&federationId=${fedData.id}`),
            axios.get(`/api/events/upcoming?federationId=${fedData.id}`),
            axios.get(`/api/federations/${fedData.id}/weekly-summary`),
            axios.get(`/api/federations/${fedData.id}/media-highlights`),
          ]);

          setTopAthletes(topAthletesRes.data);
          setEvents(eventsRes.data);
          setWeeklySummary(summaryRes.data);
          setMediaHighlights(highlightsRes.data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, [sportId]);

  const handleSportChange = (e) => {
    navigate(`/sports/${e.target.value}`);
  };

  if (!federation) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Container disableGutters maxWidth={false}>
      <Box
        sx={{
          height: 200,
          backgroundImage: 'url(/images/sport-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <FederationHeader
        name={federation.name}
        sportId={sportId}
        sports={sports}
        handleSportChange={handleSportChange}
      />

      <Box sx={{ px: 3, mt: 4 }}>
        {/* CTA Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Join as an Athlete</Typography>
                <Typography variant="body2" color="textSecondary">
                  Create your profile, track progress, join teams and more.
                </Typography>
              </CardContent>
              <CardActions>
                <Button href={`/login?role=athlete&sport=${federation.id}`} variant="contained">
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Register Your Team</Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage rosters, join tournaments, track stats and more.
                </Typography>
              </CardContent>
              <CardActions>
                <Button href={`/login?role=team&sport=${federation.id}`} variant="outlined">
                  Register Team
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Federation Stats */}
        {federation?.id ? (
          <FederationStats federationId={federation.id} />
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Stats currently unavailable.
          </Typography>
        )}

        {/* Events and Weekly Summary */}
        <Grid container spacing={2} sx={{ my: 4 }}>
          <Grid item xs={12} md={6}>
            <UpcomingEvents events={events} />
          </Grid>
          <Grid item xs={12} md={6}>
            <WeeklySummary summary={weeklySummary} />
          </Grid>
        </Grid>

        {/* Highlights */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Highlights</Typography>
          <MediaCarousel highlights={mediaHighlights} />
        </Box>

        {/* Top Performers */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Top Performers</Typography>
          <Grid container spacing={2}>
            {topAthletes.map((athlete) => (
              <Grid item xs={12} sm={4} key={athlete.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{athlete.name}</Typography>
                    <Typography variant="body2">🏅 {athlete.stat_summary || 'Top Performer'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs Section */}
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb: 3 }}>
          <Tab label="Players" />
          <Tab label="Teams" />
        </Tabs>

        {federation?.id ? (
          tab === 0 ? (
            <PlayersGrid federationId={federation.id} />
          ) : (
            <TeamsGrid federationId={federation.id} />
          )
        ) : (
          <Typography variant="body2" color="textSecondary">
            Unable to load federation data.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default FederationDetails;
