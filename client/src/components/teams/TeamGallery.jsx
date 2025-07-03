// TeamGallery.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const TeamGallery = ({ teamId }) => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/gallery`) 
      .then((res) => setMedia(res.data))
      .catch(console.error);
  }, [teamId]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Team Gallery</Typography>
        <Grid container spacing={2}>
          {media.map((item, i) => (
            <Grid size={{xs:12 , sm:6}} key={i}>
              <img src={item.url} alt={item.caption} width="100%" style={{ borderRadius: 8 }} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeamGallery;
