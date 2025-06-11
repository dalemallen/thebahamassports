
import React from 'react';
import { useParams } from 'react-router-dom';

export default function FederationDetails() {
  const params = useParams();
  return (
    <div>
      <h2>FederationDetails</h2>
      <p>Details for ID: {params.id}</p>
    </div>
  );
}
