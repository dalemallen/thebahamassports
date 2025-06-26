// InternalNotes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, Button, List, ListItem } from "@mui/material";

const InternalNotes = ({ teamId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/notes`) 
      .then(res => setNotes(res.data))
      .catch(console.error);
  }, [teamId]);

  const handleAddNote = async () => {
    try {
      const res = await axios.post(`/api/teams/${teamId}/notes`, { content: newNote });
      setNotes((prev) => [...prev, res.data]);
      setNewNote("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Internal Notes</Typography>
        <List>
          {notes.map((note, i) => (
            <ListItem key={i}>{note.content}</ListItem>
          ))}
        </List>
        <TextField
          label="Add Note"
          fullWidth
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button onClick={handleAddNote} sx={{ mt: 1 }} variant="contained">Add</Button>
      </CardContent>
    </Card>
  );
};

export default InternalNotes;