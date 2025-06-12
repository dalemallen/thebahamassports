import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FederationsList() {
  const [federations, setFederations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/federations")
      .then(res => {
        setFederations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Federations
      </Typography>

      <Grid container spacing={3}>
        {(loading ? Array.from(new Array(4)) : federations).map((fed, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={fed?.id || index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{ cursor: "pointer", height: "100%" }}
                onClick={() => navigate(`/federations/${fed.id}`)}
              >
                {loading ? (
                  <Skeleton variant="rectangular" height={140} />
                ) : (
                  <CardMedia
                    component="img"
                    height="140"
                    image={fed.logo_url || "/placeholder.png"}
                    alt={fed.name}
                    sx={{ objectFit: "contain", p: 1 }}
                  />
                )}

                <CardContent>
                  {loading ? (
                    <Skeleton width="80%" />
                  ) : (
                    <Typography variant="h6" component="div">
                      {fed.name}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
