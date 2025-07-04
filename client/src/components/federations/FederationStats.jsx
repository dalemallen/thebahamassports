import React from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  CardActionArea,
  Avatar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import SportsIcon from "@mui/icons-material/Sports";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import WorkIcon from "@mui/icons-material/Work";

const FederationStats = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const dummyStats = {
    total_athletes: 320,
    total_teams: 24,
    events_hosted: 12,
    medals_won: 38,
    rank_national: 5,
    coaches_registered: 18,
    active_players_last30d: 198,
    youth_athletes: 110,
    social_followers: 2500,
    site_visits: 1200,
    new_athletes_this_month: 42,
    active_teams_this_season: 19,
    avg_age_athletes: 23,
    gender_ratio: "60% M / 40% F",
    event_attendance: 930,
    top_club: "Bahamas Strikers",
    most_viewed_athlete: "Jayden Smith",
    injuries_reported: 3,
    coach_athlete_ratio: "1:18",
    scholarships_awarded: 6,
    // top_team_logo: "https://via.placeholder.com/50",
    top_team_record: "10W - 2L",
    top_team_division: "Division A"
  };

  const iconMap = {
    total_athletes: <EmojiEventsIcon color="primary" fontSize="large" />,
    total_teams: <GroupsIcon color="primary" fontSize="large" />,
    events_hosted: <SportsIcon color="primary" fontSize="large" />,
    medals_won: <MilitaryTechIcon color="primary" fontSize="large" />,
    rank_national: <StarIcon color="primary" fontSize="large" />,
    coaches_registered: <SchoolIcon color="primary" fontSize="large" />,
    active_players_last30d: <AccessTimeIcon color="primary" fontSize="large" />,
    youth_athletes: <ChildCareIcon color="primary" fontSize="large" />,
    social_followers: <ShareIcon color="primary" fontSize="large" />,
    site_visits: <VisibilityIcon color="primary" fontSize="large" />,
    new_athletes_this_month: <TrendingUpIcon color="primary" fontSize="large" />,
    active_teams_this_season: <TrendingUpIcon color="primary" fontSize="large" />,
    avg_age_athletes: <EmojiPeopleIcon color="primary" fontSize="large" />,
    gender_ratio: <EmojiPeopleIcon color="primary" fontSize="large" />,
    event_attendance: <FavoriteIcon color="primary" fontSize="large" />,
    top_club: <LeaderboardIcon color="primary" fontSize="large" />,
    most_viewed_athlete: <VisibilityIcon color="primary" fontSize="large" />,
    injuries_reported: <FavoriteIcon color="primary" fontSize="large" />,
    coach_athlete_ratio: <WorkIcon color="primary" fontSize="large" />,
    scholarships_awarded: <MilitaryTechIcon color="primary" fontSize="large" />,
    top_team_logo: null,
    top_team_record: null,
    top_team_division: null
  };

  const interactiveRoutes = {
    total_athletes: "/athletes",
    total_teams: "/teams",
    coaches_registered: "/coaches",
    events_hosted: "/events"
  };

  return (
    <Box sx={{ my: 5 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }} color="primary">
        Federation Stats (Sample)
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(dummyStats).map(([key, value]) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                display: "flex",
                alignItems: "center",
                px: 2,
                cursor: interactiveRoutes[key] ? "pointer" : "default"
              }}
              onClick={() => {
                if (interactiveRoutes[key]) navigate(interactiveRoutes[key]);
              }}
            >
              {key === "top_team_logo" ? (
                <Avatar
                  src={value}
                  alt="Top Team Logo"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
              ) : (
                iconMap[key] || (
                  <SportsIcon color="disabled" fontSize="large" sx={{ mr: 2 }} />
                )
              )}
              <CardContent sx={{ pl: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FederationStats;
