import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import DashboardOverview from '../../components/federations/DashboardOverview';
import NextEvents from '../../components/federations/NextEvents';
import PendingMembers from '../../components/federations/PendingMembers';
import axios from 'axios';

const DashboardFederation = () => {
  const [stats, setStats] = useState({ athletes: 0, coaches: 0, teams: 0 });
  const [events, setEvents] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, eventsRes, pendingRes] = await Promise.all([
        axios.get('/api/federations/dashboard-stats'),
        axios.get('/api/federations/events/upcoming'),
        axios.get('/api/federations/members/pending'),
      ]);

      setStats(statsRes.data);
      setEvents(eventsRes.data);
      setPendingMembers(pendingRes.data);
    };

    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await axios.patch(`/api/federations/members/${id}/approve`);
    setPendingMembers(pendingMembers.filter(m => m.id !== id));
  };

  const handleReject = async (id) => {
    await axios.patch(`/api/federations/members/${id}/reject`);
    setPendingMembers(pendingMembers.filter(m => m.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Federation Dashboard</Typography>
      <DashboardOverview stats={stats} />
      <Typography variant="h5" mt={4}>Next Events</Typography>
      <NextEvents events={events} />
      <Typography variant="h5" mt={4}>Pending Federation Members</Typography>
      <PendingMembers
        members={pendingMembers}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Container>
  );
};

export default DashboardFederation;

