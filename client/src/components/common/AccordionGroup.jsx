import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";

export default function AccordionGroup({ sections }) {
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <>
      {sections.map(({ title, items }, idx) => (
        <Accordion
          key={idx}
          expanded={expanded === title}
          onChange={handleChange(title)}
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            mb: 2,
            boxShadow: 2,
            overflow: "hidden",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${title}-content`}
            id={`${title}-header`}
            sx={{
              bgcolor: "#f7f7f7",
              px: 3,
              py: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary"
              sx={{ fontSize: 16 }}
            >
              {title}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <List dense disablePadding>
              {items.map(({ label, path }, i) => (
                <ListItem
                  key={i}
                  disableGutters
                  sx={{
                    px: 3,
                    py: 1.2,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                  component={RouterLink}
                  to={path}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: "text.primary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
