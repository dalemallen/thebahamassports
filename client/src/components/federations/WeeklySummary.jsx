import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StarIcon from "@mui/icons-material/Star";
import TimelineIcon from "@mui/icons-material/Timeline";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const iconMap = {
  match: <SportsSoccerIcon color="primary" fontSize="large" />,
  mvp: <EmojiEventsIcon color="secondary" fontSize="large" />,
  injury: <LocalHospitalIcon color="error" fontSize="large" />,
  highlight: <StarIcon color="primary" fontSize="large" />,
  update: <TimelineIcon color="action" fontSize="large" />,
  default: <TimelineIcon color="disabled" fontSize="large" />
};

const inferType = (text) => {
  if (text.includes("match")) return "match";
  if (text.includes("MVP") || text.includes("top performer")) return "mvp";
  if (text.includes("injury")) return "injury";
  if (text.includes("highlight")) return "highlight";
  return "update";
};

const WeeklySummary = ({ summary }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState(null);

  if (!summary || !summary.summary_text) {
    return (
      <Typography variant="body2" color="text.secondary">
        No summary available this week.
      </Typography>
    );
  }

  // Split summary_text by bullet delimiter
  const items = summary.summary_text.split("•").map((text) => {
    const trimmed = text.trim();
    return {
      title: trimmed,
      description: `Detail: ${trimmed}`,
      type: inferType(trimmed)
    };
  });

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 2 }}>
        Weekly Highlights
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.02)" }
                }}
              >
                <CardActionArea onClick={() => setSelected(item)}>
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    {iconMap[item.type] || iconMap.default}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {selected?.title}
          <IconButton onClick={() => setSelected(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selected?.description}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WeeklySummary;
