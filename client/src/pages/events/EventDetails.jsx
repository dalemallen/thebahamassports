
import React from 'react';
import { useParams } from 'react-router-dom';

export default function EventDetails() {
  const {eventId} = useParams();
  return (
    <div>
      <h2>EventDetails</h2>
      <p>Details for ID: {eventId}</p>
    </div>
  );
}
