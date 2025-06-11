
import React from 'react';
import { useParams } from 'react-router-dom';

export default function TeamDetails() {
  const params = useParams();
  return (
    <div>
      <h2>TeamDetails</h2>
      <p>Details for ID: {params.id}</p>
    </div>
  );
}
