// DocumentsPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, List, ListItem, Link } from "@mui/material";

const DocumentsPanel = ({ fetchUrl, uploadUrl, title = "Documents" }) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    axios.get(fetchUrl)
      .then(res => setDocs(res.data))
      .catch(console.error);
  }, [fetchUrl]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <List>
          {docs.map((doc, idx) => (
            <ListItem key={idx}>
              <Link href={doc.url} target="_blank" rel="noopener">{doc.name}</Link>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DocumentsPanel;