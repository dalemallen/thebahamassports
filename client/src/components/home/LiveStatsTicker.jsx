import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveStatsTicker() {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [index, setIndex] = useState(0);

  // Fetch upcoming events
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((event) => {
          const date = new Date(event.start_date);
          const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const day = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
          return `🏆 ${event.title}: ${day} @ ${time} – ${event.location || "TBD"}`;
        });
        setEvents(formatted);
      })
      .catch(() => {
        setEvents([
          "⚽ U17 Finals: June 15 @ 5:00PM – Thomas A. Robinson Stadium",
        ]);
      });
  }, []);

  // Cycle through events
  useEffect(() => {
    if (events.length > 1) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % events.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [events]);

  if (events.length === 0) return null;

  return (
    <Box
      sx={{
        width: "100%",
        py: 1.5,
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", height: "32px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {events[index]}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
