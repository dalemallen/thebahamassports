
import React from 'react';
import { useParams } from 'react-router-dom';

export default function SportsDetails() {
  const { sportId} = useParams();

  return (
    <div>
      <h2>SportDetails</h2>
      <p>Details for ID: {sportId}</p>
    </div>
  );
}
