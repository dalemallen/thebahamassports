import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Skeleton,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";

export default function FederationsList() {
  const [federations, setFederations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/federations")
      .then((res) => {
        setFederations(res.data);
        setLoading(false);
      })
      .catch((err) => {
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
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={fed?.id || index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 2,
                }}
                onClick={() => !loading && navigate(`/federations/${fed.id}`)}
              >
                {loading ? (
                  <Skeleton variant="circular" width={100} height={100} />
                ) : fed.logo_url ? (
                  <Avatar
                    src={fed.logo_url}
                    alt={fed.name}
                    sx={{ width: 100, height: 100, mb: 1 }}
                    variant="rounded"
                  />
                ) : (
                  <Avatar
                    sx={{ width: 100, height: 100, bgcolor: "primary.main", mb: 1 }}
                    variant="rounded"
                  >
                    <EmojiFlagsIcon sx={{ fontSize: 40, color: "#fff" }} />
                  </Avatar>
                )}

                <CardContent sx={{ p: 1 }}>
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
