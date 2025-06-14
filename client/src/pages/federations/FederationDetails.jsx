import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, CircularProgress } from "@mui/material";
import FederationHeader from "../../components/federations/FederationHeader";
import FederationPrograms from "../../components/federations/FederationPrograms";
import TeamGrid from "../../components/federations/TeamGrid";
import NationalRoster from "../../components/common/NationalRoster";
import FederationNews from "../../components/federations/FederationNews";
import SponsorCarousel from "../../components/common/SponsorCarousel";


export default function FederationDetails() {
  const { federationId } = useParams();
  const [federation, setFederation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFederation = async () => {
      try {
        const { data } = await axios.get(`/api/federations/${federationId}`);
        setFederation(data);
      } catch (err) {
        console.error("Error fetching federation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFederation();
  }, [federationId]);

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (!federation) return <Container sx={{ mt: 4 }}>Federation not found</Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FederationHeader data={federation} />
      <FederationPrograms programs={federation.programs || []} />
      <TeamGrid teams={federation.teams || []} />
      <NationalRoster players={federation.national_roster || []} />
      <FederationNews news={federation.news || []} />
      <SponsorCarousel sponsors={federation.sponsors || []} />
    </Container>
  );
}
