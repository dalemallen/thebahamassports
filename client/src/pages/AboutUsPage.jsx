import React from "react";
import { Container, Grid, Typography, Box, Button, Divider } from "@mui/material";
import { motion } from "framer-motion";


const sections = [
  {
    title: "Our Mission",
    image: "/illustration/mission.png",
    content: `To provide a centralized digital hub that connects all stakeholders in Bahamian sports — streamlining registrations, event management, team and athlete tracking, and federation coordination.`
  },
  {
    title: "What We’re Solving",
    image: "/illustration/solving.png",
    content: `• Outdated or manual registration and reporting processes\n• Lack of centralized data on teams, athletes, and federations\n• Difficulty tracking athletes progress and stats\n• Missed opportunities for athlete discovery and event promotion`
  },
  {
    title: "Who We Serve",
    image: "/illustration/serve.png",
    content: `Athletes — build your profile, get discovered, register for leagues\nCoaches & Teams — manage rosters, track stats, and organize games\nFederations — oversee national sports activities with modern tools\nFans & Families — follow your teams, discover events, and support youth sports`
  },
  {
    title: "Why It Matters",
    image: "/illustration/matters.png",
    content: `Bahamian athletes are world-class — but the systems supporting them need to catch up. TheBahamasSports bridges this gap with tools built for our islands, by people who understand the culture and potential of Bahamian sports.`
  },
  {
    title: "What’s Next",
    image: "/illustration/whatsNext.png",
    content: `• More integrated features for live results and scouting\n• Federation storefronts and media showcases\n• Event ticketing and sponsorship tools\n• Mobile-first design for island-wide access`
  },
];

const AboutUsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" fontWeight={800} gutterBottom sx={{ fontSize: { xs: 32, md: 44 }, letterSpacing: "-0.5px" }}>
          Empowering Bahamian Sports Through Technology
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "700px", mx: "auto", fontSize: { xs: 16, md: 18 }, lineHeight: 1.75 }}>
          TheBahamasSports is a digital platform built to unify, modernize, and elevate the sports experience across the Bahamas. Whether you're an athlete, coach, federation, or fan — this platform is designed to support your journey from grassroots to greatness.
        </Typography>
      </Box>

      {sections.map((section, index) => (
        <Grid
          key={section.title}
          container
          spacing={6}
          alignItems="center"
          direction={index % 2 === 0 ? "row" : "row-reverse"}
          sx={{ mb: 10 }}
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={section.image}
              alt={section.title}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "contain",
                borderRadius: 3,
                boxShadow: 4,
                mx: "auto",
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: 24, md: 32 }, letterSpacing: "-0.25px" }}
            >
              {section.title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              whiteSpace="pre-line"
              sx={{ lineHeight: 1.8, fontSize: { xs: 15.5, md: 17.5 }, maxWidth: 520 }}
            >
              {section.content}
            </Typography>
          </Grid>
        </Grid>
      ))}

      <Divider sx={{ my: 8 }} />

      <Box
        textAlign="center"
        mt={8}
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ fontSize: { xs: 22, md: 26 } }}>
          📣 Let’s Connect
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 3, fontSize: { xs: 15, md: 17 }, lineHeight: 1.7 }}>
          Are you a federation, coach, or local leader? We’d love to work with you to shape the future of Bahamian sports.
        </Typography>
        <Button variant="contained" size="large" href="/contact" sx={{ px: 5, py: 1.5, fontWeight: 600 }}>
          Contact Us
        </Button>
      </Box>
    </Container>
  );
};

export default AboutUsPage;
