import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box, Typography, Container, Grid, Button, Chip, CircularProgress,
  Breadcrumbs, Link, Paper, Divider, Avatar
} from "@mui/material";
import { motion } from "framer-motion";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import ShareButton from "../../components/common/ShareButton";

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/api/events/${eventId}`);
        setEvent(data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <Container sx={{ textAlign: "center", mt: 10 }}><CircularProgress /></Container>;
  }

  if (!event) {
    return <Container sx={{ textAlign: "center", mt: 10 }}><Typography>Event not found.</Typography></Container>;
  }

  const formattedDate = new Date(event.start_date).toLocaleDateString();
  const formattedTime = new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endDate = event.end_date && new Date(event.end_date).toLocaleDateString();

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: `linear-gradient(90deg, #00A3E0, #007BB8)`,
          color: "#fff",
          py: 4,
          textAlign: "center"
        }}
      >

        <Container>
          <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
            <Avatar
              src={event.logo_url || ""}
              sx={{
                bgcolor: "#FFD100",
                color: "#000",
                width: 80,
                height: 80,
                fontSize: 40
              }}
            >
              {!event.logo_url && <EventAvailableIcon fontSize="large" />}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>{event.title}</Typography>
              <Typography>{formattedDate} • {event.location}</Typography>
              <Box mt={1}>
                <Chip label={event.type || "Event"} color="secondary" sx={{ mr: 1 }} />
                <Chip label={event.status} color="primary" />
                {/* <Chip
  icon={<CheckCircleIcon />}
  label={event.status}
  color={event.status === "upcoming" ? "success" : "default"}
/> */}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      
  <ShareButton title={event.title} />

      <Container sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/">Home</Link>
          <Link href="/schedule">Schedule</Link>
          <Typography color="text.primary">{event.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{xs:12, md:8}}>
            <Grid container spacing={2}>
              {/* Details */}
<Grid size={{xs:12, md:6}}>
  <Paper
    elevation={2}
    sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: "#fff",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Typography variant="h6" fontWeight={700}>
      Details
    </Typography>
    <Divider sx={{ mb: 2, bgcolor: "#FFD100" }} />

    <Box display="flex" flexDirection="column" gap={2}>
      {/* Date */}
      <Box display="flex" gap={2}>
        <CalendarMonthIcon color="primary" />
        <Box>
          <Typography variant="caption" fontWeight={600}>
            Date
          </Typography>
          <Link
            href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${new Date(event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(event.end_date || event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description || ''} 
END:VEVENT
END:VCALENDAR`}
            download={`${event.title}.ics`}
            underline="hover"
            color="text.primary"
            sx={{ display: "block", fontSize: 14 }}
          >
            {new Date(event.start_date).toLocaleDateString()} 
            {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString()}`}
          </Link>
        </Box>
      </Box>

      {/* Time */}
      <Box display="flex" gap={2}>
        <AccessTimeIcon color="primary" />
        <Box>
          <Typography variant="caption" fontWeight={600}>
            Time
          </Typography>
          <Typography variant="body2">
            {new Date(event.start_date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>

      {/* Venue */}
      <Box display="flex" gap={2}>
        <LocationOnIcon color="primary" />
        <Box>
          <Typography variant="caption" fontWeight={600}>
            Venue
          </Typography>
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
            target="_blank"
            rel="noopener"
            underline="hover"
            color="text.primary"
            sx={{ display: "block", fontSize: 14 }}
          >
            {event.location}
          </Link>
        </Box>
      </Box>

      {/* Sport */}
      <Box display="flex" gap={2}>
        <SportsSoccerIcon color="primary" />
        <Box>
          <Typography variant="caption" fontWeight={600}>
            Sport
          </Typography>
          <Link
            href={`/federations/${event.sport_id || ""}`}
            underline="hover"
            color="text.primary"
            sx={{ display: "block", fontSize: 14 }}
          >
            {event.sport_name}
          </Link>
        </Box>
      </Box>

      {/* Organizer */}
      <Box display="flex" gap={2}>
        <PersonIcon color="primary" />
        <Box>
          <Typography variant="caption" fontWeight={600}>
            Organizer
          </Typography>
          <Link
            href={`/organizers/${event.organizer_id || ""}`}
            underline="hover"
            color="text.primary"
            sx={{ display: "block", fontSize: 14 }}
          >
            {event.organizer || "TBD"}
          </Link>
        </Box>
      </Box>
    </Box>
  </Paper>
</Grid>

   {/* Contact */}
<Grid size={{xs:12, md:6}}>
  <Paper
    elevation={2}
    sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: "#fff",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Typography variant="h6" fontWeight={700} gutterBottom>
      Contact
    </Typography>
    <Divider sx={{ mb: 2, bgcolor: "#FFD100" }} />

    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <MailOutlineIcon color="primary" />
        <Link
          href={`mailto:${event.contact_email || "info@example.com"}`}
          underline="hover"
          color="text.primary"
        >
          {event.contact_email || "info@example.com"}
        </Link>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <PhoneIcon color="primary" />
        <Link
          href={`tel:${event.contact_phone || "+1 (000) 000-0000"}`}
          underline="hover"
          color="text.primary"
        >
          {event.contact_phone || "+1 (000) 000-0000"}
        </Link>
      </Box>
    </Box>
  </Paper>
</Grid>



              {/* Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <Grid size={{xs:12}}>
         <Paper
    elevation={2}
    sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: "#fff",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
    }}
  >
    <Typography variant="h6" fontWeight={700} gutterBottom>
      Schedule
    </Typography>
    <Divider sx={{ mb: 2, bgcolor: "#FFD100" }} />

    {(event.schedule && event.schedule.length > 0) ? (
      <Box display="flex" flexDirection="column" gap={1}>
        {event.schedule.map((item, idx) => (
          <Box
            key={idx}
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ py: 1, px: 1, borderRadius: 2, "&:hover": { bgcolor: "#f9f9f9" } }}
          >
            <AccessTimeIcon sx={{ color: "#00A3E0" }} />
            <Typography variant="body2">
              <strong>{item.time}</strong> — {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        No schedule available yet.
      </Typography>
    )}
  </Paper>
                </Grid>
              )}

              {/* Teams */}
              {event.teams && event.teams.length > 0 && (
                <Grid size={{xs:12}}>
             <Paper
    elevation={2}
    sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: "#fff",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
    }}
  >
    <Typography variant="h6" fontWeight={700} gutterBottom>
      Teams
    </Typography>
    <Divider sx={{ mb: 2, bgcolor: "#FFD100" }} />

    {(event.teams && event.teams.length > 0) ? (
      <Box display="flex" flexDirection="column" gap={2}>
        {event.teams.map((team, idx) => (
          <Box
            key={idx}
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ py: 1, px: 1, borderRadius: 2, "&:hover": { bgcolor: "#f9f9f9" } }}
          >
            <Box
              sx={{
                bgcolor: "#FFD100",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={team.logo_url || "/placeholder_logo.svg"}
                alt={team.name}
                style={{
                  width: 24,
                  height: 24,
                  objectFit: "contain",
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {team.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {team.tagline || "No tagline"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        No teams listed for this event.
      </Typography>
    )}
  </Paper>
                </Grid>
              )}

              {/* Sponsors */}
              {event.sponsors && event.sponsors.length > 0 && (
                <Grid size={{xs:12}}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Sponsors</Typography>
                    <Divider sx={{ mb: 1, bgcolor: "#FFD100" }} />
                    <Grid container spacing={2}>
                      {event.sponsors.map((s, idx) => (
                        <Grid size={{xs:12, md:3}} key={idx}>
                          <img
                            src={s.logo_url || "/placeholder_logo.svg"}
                            alt={s.name}
                            style={{ width: "100%", borderRadius: 4 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              )}

              {/* Map */}
              <Grid size={{xs:12}}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">Location</Typography>
                  <Divider sx={{ mb: 1, bgcolor: "#FFD100" }} />
                  <iframe
                    title="map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                    width="100%"
                    height="300"
                    style={{ borderRadius: 8 }}
                    frameBorder="0"
                  ></iframe>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid size={{xs:12, md:4}}>
               {/* Description */}
<Grid size={{xs:12}}>
  <Paper
    elevation={2}
    sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: "#fff",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Typography variant="h6" fontWeight={700} gutterBottom>
      Description
    </Typography>
    <Divider sx={{ mb: 2, bgcolor: "#FFD100" }} />

    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ lineHeight: 1.6 }}
    >
      {event.description ||
        `No description provided yet. Stay tuned for more details about the event.`}
    </Typography>
  </Paper>
</Grid>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                bgcolor: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                position: "sticky",
                top: 100
              }}
            >
              <Typography variant="h6">Ready to join?</Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: "#00A3E0", "&:hover": { bgcolor: "#008EC7" } }}
                size="large"
              >
                Register Now
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: "#FFD100", color: "#FFD100", "&:hover": { bgcolor: "#FFF8D1" } }}
                size="large"
              >
                View Full Schedule
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
