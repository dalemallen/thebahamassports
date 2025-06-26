
import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

const PendingMembers = ({ members, onApprove, onReject }) => (
  <Box>
    {members.map((member) => (
      <Paper key={member.id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography>{member.name}</Typography>
          <Typography variant="caption">{member.role}</Typography>
        </Box>
        <Box>
          <Button color="success" onClick={() => onApprove(member.id)}>Approve</Button>
          <Button color="error" onClick={() => onReject(member.id)}>Reject</Button>
        </Box>
      </Paper>
    ))}
  </Box>
);

export default PendingMembers;
