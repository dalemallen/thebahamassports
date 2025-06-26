// TeamDuesTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const TeamDuesTable = ({ teamId }) => {
  const [dues, setDues] = useState([]);

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/dues`) 
      .then(res => setDues(res.data))
      .catch(console.error);
  }, [teamId]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Team Dues</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dues.map((d, i) => (
              <TableRow key={i}>
                <TableCell>{d.player}</TableCell>
                <TableCell>{d.amount}</TableCell>
                <TableCell>{d.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeamDuesTable;