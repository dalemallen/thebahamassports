import React from 'react';
import Grid from '@mui/material/Grid';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import UpcomingEvents from '../../components/dashboard/UpcomingEvents';
import QuickStats from '../../components/common/QuickStats';
import OpportunitiesSection from '../../components/dashboard/OpportunitiesSection';
import DocumentsSection from '../../components/common/DocumentsSection';
import TeamList from '../../components/common/TeamList';

export default function DashboardAthlete() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12  }}>
        <WelcomeBanner name="Jason" sport="Basketball (U17)" status="Active" lastLogin="June 16" />
      </Grid>
      <Grid size={{ xs: 12, md: 6  }}>
        <UpcomingEvents />
      </Grid>
      <Grid size={{ xs: 12, md: 6  }}>
        <QuickStats />
      </Grid>
      <Grid size={{ xs: 12  }}>
        <OpportunitiesSection />
      </Grid>
      <Grid size={{ xs: 12, md: 6  }}>
        <TeamList />
      </Grid>
      <Grid size={{ xs: 12, md: 6  }}>
        <DocumentsSection />
      </Grid>
    </Grid>
  );
}