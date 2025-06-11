import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem } from '@mui/material';

const Home = () => {
  const [roles, setRoles] = useState([]);


  useEffect(() => {
    axios.get('/api/roles')
      .then(res => {setRoles(res.data); console.log('res.data: ', res.data);})
      .catch(err => console.error(err));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4">Available Roles</Typography>
      <List>3
        {Array.isArray(roles) && roles.map(role => (
          <ListItem key={role.id}>{role.name}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Home;
