import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Grid,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const TeamAnnouncements = ({ teamId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`/api/announcements/team/${teamId}`);
        // sort and show only the 3 most recent
        const recent = res.data
          .filter((a) => !a.is_deleted)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setAnnouncements(recent);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };

    if (teamId) fetchAnnouncements();
  }, [teamId]);

  const handleDelete = async (announcementId) => {
    try {
      await axios.delete(`/api/announcements/${announcementId}`);
      setAnnouncements((prev) =>
        prev.filter((a) => a.id !== announcementId)
      );
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Announcements
      </Typography>

      {announcements.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No announcements yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {announcements.map((a) => (
            <Grid size={{xs:12, sm:6, md:4}} key={a.id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    {new Date(a.created_at).toLocaleDateString()}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {a.title}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2">{a.body}</Typography>
                </CardContent>

                {(user?.sub === a.created_by || user?.role === 'staff') && (
                  <CardActions disableSpacing>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(a.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TeamAnnouncements;
