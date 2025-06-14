import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Box } from "@mui/material";

import HeroBanner from "../../components/home/HeroBanner";
import PartnerCarousel from "../../components/home/PartnerCarousel";
import FeatureGrid from "../../components/home/FeatureGrid";
import HowItWorks from "../../components/home/HowItWorks";
import RoleHighlights from "../../components/home/RoleHighlights";
import LiveStatsTicker from "../../components/home/LiveStatsTicker";
import UserSpotlight from "../../components/home/UserSpotlight";
import StayConnected from "../../components/home/StayConnected";

export default function Home() {
  const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims();
        const userRole = claims && claims["https://thebahamassports.com/role"];
        setRole(userRole || "");
      }
    };
    fetchRole();
  }, [isAuthenticated, getIdTokenClaims]);

  return (
    <Box>
      <HeroBanner role={role} />
      <Container maxWidth="lg">
        <PartnerCarousel />
        <FeatureGrid />
        <HowItWorks />
        <RoleHighlights role={role} />
      </Container>
      <LiveStatsTicker />
      <Container maxWidth="lg">
        <UserSpotlight role={role} />
        <StayConnected />
      </Container>
    </Box>
  );
}
