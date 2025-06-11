
import React from 'react';
import { useParams } from 'react-router-dom';

export default function PlayerDetails() {
  const params = useParams();
  return (
    <div>
      <h2>PlayerDetails</h2>
      <p>Details for ID: {params.id}</p>
    </div>
  );
}
