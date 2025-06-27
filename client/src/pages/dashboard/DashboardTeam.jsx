import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import TeamHeader from "../../components/teams/TeamHeader";
import TeamStatsPanel from "../../components/teams/TeamStatsPanel";
import UpcomingEventsPanel from "../../components/teams/UpcomingEventsPanel";
import TeamRoster from "../../components/teams/TeamRoster";
import RecentMatches from "../../components/teams/RecentMatches";
import AttendanceTracker from "../../components/teams/AttendanceTracker";
import TeamAnnouncements from "../../components/teams/TeamAnnouncements";
import TeamGallery from "../../components/teams/TeamGallery";
import DocumentsPanel from "../../components/teams/DocumentsPanel";
import TeamDuesTable from "../../components/teams/TeamDuesTable";
import InternalNotes from "../../components/teams/InternalNotes";
import TeamInfoBlock from "../../components/teams/TeamInfoBlock";

const TeamDashboard = ({ teamId, team, userId }) => {
  console.log('userId: ', userId);
  console.log('teamId: ', teamId);
  console.log('team: ', team);
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
        {team && <TeamInfoBlock team={team} />}
      </Grid>
    </Box>
  );
};

export default TeamDashboard;
