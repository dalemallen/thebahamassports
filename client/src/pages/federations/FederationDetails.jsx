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
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
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
  const theme = useTheme();
  const { sportId } = useParams();
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [federation, setFederation] = useState(null);
  const [topAthletes, setTopAthletes] = useState([]);
  const [events, setEvents] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [mediaHighlights, setMediaHighlights] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportsRes = await axios.get('/api/sports/with-federations');
        setSports(sportsRes.data);

        const federationRes = await axios.get(`/api/federations/by-sport/${sportId}`);
        const fedData = federationRes.data;
        setFederation(fedData);

        if (fedData?.id) {
          const [topAthletesRes, eventsRes, summaryRes, highlightsRes] = await Promise.all([
            axios.get(`/api/athletes/top/${sportId}/${fedData.id}`),
            axios.get(`/api/events/upcoming/${fedData.id}`),
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

  if (!federation) return <CircularProgress sx={{ mt: 5, mx: 'auto', display: 'block' }} />;

  return (
    <Container disableGutters maxWidth={false}>
      <Box
        sx={{
          height: 280,
          backgroundImage: `url(${federation.cover_image_url || '/images/sport-banner.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      />

      <FederationHeader
        name={federation.name}
        sportId={sportId}
        sports={sports}
        handleSportChange={handleSportChange}
      />

      <Box sx={{ px: 3, mt: 6 }}>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary" fontWeight={700}>Join as an Athlete</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your profile, track progress, join teams and more.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button href={`/login?role=athlete&sport=${federation.id}`} variant="contained">
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary" fontWeight={700}>Register Your Team</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage rosters, join tournaments, track stats and more.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button href={`/login?role=team&sport=${federation.id}`} variant="outlined">
                  Register Team
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <FederationStats federationId={federation.id} />

        <Grid container spacing={3} sx={{ my: 5 }}>
          <Grid item xs={12} md={6}>
            <UpcomingEvents events={events} />
          </Grid>
          <Grid item xs={12} md={6}>
            <WeeklySummary summary={weeklySummary} />
          </Grid>
        </Grid>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }} color="primary">
            Highlights
          </Typography>
          <MediaCarousel highlights={mediaHighlights} />
        </Box>

        <Box sx={{ my: 5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }} color="primary">
            Top Performers
          </Typography>
          <Grid container spacing={2}>
            {topAthletes.map((athlete) => (
              <Grid item xs={12} sm={4} key={athlete.id}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6">{athlete.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      🏅 {athlete.stat_summary || 'Top Performer'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 4 }}
        >
          <Tab label="Players" />
          <Tab label="Teams" />
        </Tabs>

        {tab === 0 ? (
          <PlayersGrid players={topAthletes} />
        ) : (
          <TeamsGrid federationId={federation.id} />
        )}
      </Box>
    </Container>
  );
};

export default FederationDetails;
