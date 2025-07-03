import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Container,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import AccordionGroup from "./AccordionGroup";
import { motion } from "framer-motion";
import axios from "axios";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sports, setSports] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/sports/with-federations");
        const sportsList = data.map(({ sport }) => ({
          label: sport.name,
          path: `/sports/${sport.id}`,
        }));

        const staticLinks = [
          { label: "Schedule", path: "/schedule" },
          { label: "About Us", path: "/aboutus" },
          { label: "Contact", path: "/contact" },
        ];

        setSections([
          { title: "Sports", items: sportsList },
          { title: "Pages", items: staticLinks },
        ]);
      } catch (err) {
        console.error("Failed to fetch footer data:", err);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", pt: 8, pb: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          align="center"
          fontWeight={900}
          sx={{ mb: 6 }}
        >
          Explore TheBahamasSports
        </Typography>

        {isMobile ? (
          <AccordionGroup sections={sections} />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <Stack spacing={4}>
              {sections.map((section, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  variants={itemVariants}
                  sx={{
                    px: { xs: 2, md: 6 },
                    py: 4,
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f7f7f7",
                    borderRadius: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                  >
                    {section.title}
                  </Typography>

                  <Grid container spacing={2}>
                    {section.items.map((item, i) => (
                      <Grid
                 size={{xs:12, sm:6, 
                  md:section.title === "Sports" ? 3 : 4 
                }}
               
                        key={i}
                      >
                        <Link
                          href={item.path}
                          underline="hover"
                          color="textPrimary"
                          sx={{ display: "block", mb: 1, fontWeight: 500 }}
                        >
                          {item.label}
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          </motion.div>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 6 }}
        >
          © {new Date().getFullYear()} TheBahamasSports. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
