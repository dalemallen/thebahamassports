// AttendanceTracker.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const AttendanceTracker = ({ teamId }) => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    axios.get(`/api/teams/${teamId}/attendance`) 
      .then((res) => setAttendance(res.data))
      .catch(console.error);
  }, [teamId]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Attendance</Typography>
        <Table>
          <TableBody>
            {attendance.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.player}</TableCell>
                <TableCell>{row.attendance_date}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;