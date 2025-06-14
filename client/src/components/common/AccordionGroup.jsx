import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";

export default function AccordionGroup({ sections }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  return (
    <>
      {sections.map((section, index) => (
        <Accordion
          key={index}
          expanded={expanded === section.title}
          onChange={handleChange(section.title)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold" color="primary">
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {section.items.map(({ label, path }, idx) => (
                <ListItem
                  key={idx}
                  button
                  component={RouterLink}
                  to={path}
                  disableGutters
                >
                  <ListItemText primary={label} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
          <Divider />
        </Accordion>
      ))}
    </>
  );
}
