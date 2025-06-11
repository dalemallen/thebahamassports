
import React from 'react';
import { useParams } from 'react-router-dom';

export default function SportsDetails() {
  const params = useParams();
  return (
    <div>
      <h2>SportDetails</h2>
      <p>Details for ID: {params.id}</p>
    </div>
  );
}
