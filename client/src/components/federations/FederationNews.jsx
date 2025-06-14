import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

export default function FederationNews({ articles = [] }) {
  return (
    <div>
      <Typography variant="h5" gutterBottom>News & Updates</Typography>
      <List>
        {articles.map((article, idx) => (
          <ListItem key={idx} alignItems="flex-start">
            <ListItemText primary={article.title} secondary={article.date} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}