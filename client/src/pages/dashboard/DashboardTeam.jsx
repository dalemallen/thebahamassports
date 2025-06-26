import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import TeamHeader from "./TeamHeader";
import TeamStatsPanel from "./TeamStatsPanel";
import UpcomingEventsPanel from "./UpcomingEventsPanel";
import TeamRoster from "./TeamRoster";
import RecentMatches from "./RecentMatches";
import AttendanceTracker from "./AttendanceTracker";
import TeamAnnouncements from "./TeamAnnouncements";
import TeamGallery from "./TeamGallery";
import DocumentsPanel from "./DocumentsPanel";
import TeamDuesTable from "./TeamDuesTable";
import InternalNotes from "./InternalNotes";

const TeamDashboard = ({ teamId, team, userId }) => {
  return (
    <Box sx={{ p: 3 }}>
      <TeamHeader team={team} editable={true} onUpdateImages={() => {}} />

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <TeamStatsPanel teamId={teamId} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UpcomingEventsPanel teamId={teamId} />
        </Grid>

        <Grid item xs={12}>
          <TeamRoster teamId={teamId} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentMatches teamId={teamId} />
        </Grid>

        <Grid item xs={12} md={6}>
          <AttendanceTracker teamId={teamId} userId={userId} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TeamAnnouncements teamId={teamId} userId={userId} />
        </Grid>

        <Grid item xs={12} md={6}>
          <TeamGallery teamId={teamId} userId={userId} />
        </Grid>

        <Grid item xs={12}>
          <DocumentsPanel
            title="Team Documents"
            fetchUrl={`/api/teams/${teamId}/documents`}
            uploadUrl={`/api/teams/${teamId}/documents`}
            canUpload={true}
          />
        </Grid>

        <Grid item xs={12}>
          <TeamDuesTable teamId={teamId} />
        </Grid>

        <Grid item xs={12}>
          <InternalNotes teamId={teamId} userId={userId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamDashboard;
