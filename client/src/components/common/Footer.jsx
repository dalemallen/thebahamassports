import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Container,
  useTheme,
  useMediaQuery
} from "@mui/material";
import AccordionGroup from "./AccordionGroup";

const allSports = [
  "Basketball", "Football", "Track & Field", "Volleyball", "Baseball", "Softball",
  "Rugby", "Swimming", "Soccer", "Tennis", "Boxing", "Cycling", "Cricket", "Golf",
  "Judo", "Karate", "Sailing", "Shooting", "Table Tennis", "Taekwondo", "Triathlon",
  "Weightlifting", "Wrestling", "Gymnastics"
];

const desktopLinks = {
  Sports: allSports,
  Features: [
    "Registration & Payment",
    "Scheduling",
    "Fundraising",
    "Website Builder",
    "Athlete Profiles",
    "Team & League Management"
  ],
  Accounts: ["Athletes", "Teams", "Coaches", "Sponsors", "Scouts"],
  Events: ["Leagues", "Tournaments", "Interschool"],
  Company: ["About Us", "Contact Us"]
};

const mobileSections = [
  {
    title: "Sports",
    items: allSports.map(s => ({ label: s, path: `/sports/${s.toLowerCase().replace(/ /g, "-")}` }))
  },
  {
    title: "Features",
    items: desktopLinks.Features.map(f => ({ label: f, path: `/features/${f.toLowerCase().replace(/ /g, "-")}` }))
  },
  {
    title: "Accounts",
    items: desktopLinks.Accounts.map(a => ({ label: a, path: `/accounts/${a.toLowerCase()}` }))
  },
  {
    title: "Events",
    items: desktopLinks.Events.map(e => ({ label: e, path: `/events/${e.toLowerCase()}` }))
  },
  {
    title: "Company",
    items: desktopLinks.Company.map(c => ({ label: c, path: `/${c.toLowerCase().replace(/ /g, "-")}` }))
  }
];

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box component="footer" sx={{ backgroundColor: "#f4f4f4", pt: 6, pb: 4 }}>
      <Container maxWidth="xl">
        {isMobile ? (
          <AccordionGroup sections={mobileSections} />
        ) : (
          <Grid container spacing={4}>
            {Object.entries(desktopLinks).map(([section, links]) => (
              <Grid item xs={6} sm={4} md={2.4} key={section}>
                <Typography variant="subtitle1" color="primary" fontWeight="bold" gutterBottom>
                  {section}
                </Typography>
                {links.map((label, idx) => (
                  <Link
                    href={`/sports/${label.toLowerCase().replace(/ /g, "-")}`}
                    key={idx}
                    underline="hover"
                    color="textPrimary"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    {label}
                  </Link>
                ))}
              </Grid>
            ))}
          </Grid>
        )}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} TheBahamasSports. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
