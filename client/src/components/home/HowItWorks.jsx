import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const steps = [
  {
    title: "Create Your Free Account",
    description: "Choose your role — Athlete, Team, Coach, or Federation — and get started instantly.",
    icon: "👤",
  },
  {
    title: "Build Your Profile",
    description: "Add player info, team rosters, or event details. Showcase your organization.",
    icon: "📄",
  },
  {
    title: "Join or Host Events",
    description: "Apply to leagues or tournaments — or host your own with our tools.",
    icon: "🏆",
  },
  {
    title: "Manage Everything Online",
    description: "Use dashboards to handle schedules, communications, and RSVPs from anywhere.",
    icon: "📱",
  },
];

export default function HowItWorks() {
  return (
    <Box sx={{ py: 8, px: 2, backgroundColor: "#f9f9f9" }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        How It Works
      </Typography>
      <Typography align="center" sx={{ mb: 4 }}>
        A simple 4-step process to power your sports journey — from grassroots to greatness.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, i) => (
          <Grid item key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h3" gutterBottom>{step.icon}</Typography>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
