import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Skeleton
} from "@mui/material";

export default function FederationDetails() {
  const { id } = useParams();
  console.log('id: ', id);
  const [federation, setFederation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/federations/${id}`)
      .then(res => {
        setFederation(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={200} />
        <Skeleton height={40} width="60%" sx={{ mt: 2 }} />
        <Skeleton height={30} width="40%" />
      </Container>
    );
  }

  if (!federation) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6">Federation not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src={federation.logo_url}
                alt={federation.name}
                sx={{ width: 80, height: 80 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{federation.name}</Typography>
              <Typography variant="body2">President: {federation.president}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
